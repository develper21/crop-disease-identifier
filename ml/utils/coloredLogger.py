import logging
import sys
from datetime import datetime
from typing import Optional, Dict, Any
from enum import Enum

# ANSI color codes for terminal output
class Colors:
    reset = '\x1b[0m'
    bright = '\x1b[1m'
    dim = '\x1b[2m'
    red = '\x1b[31m'
    green = '\x1b[32m'
    yellow = '\x1b[33m'
    blue = '\x1b[34m'
    magenta = '\x1b[35m'
    cyan = '\x1b[36m'
    white = '\x1b[37m'
    bg_red = '\x1b[41m'
    bg_green = '\x1b[42m'
    bg_yellow = '\x1b[43m'
    bg_blue = '\x1b[44m'
    bg_magenta = '\x1b[45m'
    bg_cyan = '\x1b[46m'
    bg_white = '\x1b[47m'

class LogType(Enum):
    SUCCESS = 'SUCCESS'
    FAILED = 'FAILED'
    INFO = 'INFO'
    WARNING = 'WARNING'
    ERROR = 'ERROR'
    DEBUG = 'DEBUG'

class ColoredLogger:
    def __init__(self, name: str = 'ML-SERVICE'):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.DEBUG)
        
        # Create console handler with custom formatter
        self.handler = logging.StreamHandler(sys.stdout)
        self.handler.setLevel(logging.DEBUG)
        
        # Set custom formatter
        self.handler.setFormatter(ColoredFormatter())
        
        # Add handler to logger
        if not self.logger.handlers:
            self.logger.addHandler(self.handler)
    
    def _get_color(self, log_type: LogType) -> str:
        color_map = {
            LogType.SUCCESS: Colors.green,
            LogType.FAILED: Colors.red,
            LogType.WARNING: Colors.yellow,
            LogType.ERROR: Colors.red,
            LogType.INFO: Colors.blue,
            LogType.DEBUG: Colors.cyan
        }
        return color_map.get(log_type, Colors.white)
    
    def _format_timestamp(self) -> str:
        return datetime.now().isoformat()
    
    def _log(self, log_type: LogType, service: str, operation: str, message: str, 
             details: Optional[Dict[str, Any]] = None):
        color = self._get_color(log_type)
        reset = Colors.reset
        timestamp = self._format_timestamp()
        type_str = log_type.value.ljust(7)
        service_str = service.ljust(15)
        operation_str = operation.ljust(20)
        
        log_msg = f"{color}[{type_str}]{reset} {Colors.dim}{timestamp}{reset} {Colors.cyan}{service_str}{reset} {Colors.magenta}{operation_str}{reset} {message}"
        
        if details:
            log_msg += f" {Colors.dim}{str(details)}{reset}"
        
        # Map to standard logging levels
        if log_type in [LogType.ERROR, LogType.FAILED]:
            self.logger.error(log_msg)
        elif log_type == LogType.WARNING:
            self.logger.warning(log_msg)
        elif log_type == LogType.INFO:
            self.logger.info(log_msg)
        elif log_type == LogType.DEBUG:
            self.logger.debug(log_msg)
        else:  # SUCCESS
            self.logger.info(log_msg)
    
    def success(self, service: str, operation: str, message: str, details: Optional[Dict[str, Any]] = None):
        self._log(LogType.SUCCESS, service, operation, message, details)
    
    def failed(self, service: str, operation: str, message: str, details: Optional[Dict[str, Any]] = None):
        self._log(LogType.FAILED, service, operation, message, details)
    
    def info(self, service: str, operation: str, message: str, details: Optional[Dict[str, Any]] = None):
        self._log(LogType.INFO, service, operation, message, details)
    
    def warning(self, service: str, operation: str, message: str, details: Optional[Dict[str, Any]] = None):
        self._log(LogType.WARNING, service, operation, message, details)
    
    def error(self, service: str, operation: str, message: str, details: Optional[Dict[str, Any]] = None):
        self._log(LogType.ERROR, service, operation, message, details)
    
    def debug(self, service: str, operation: str, message: str, details: Optional[Dict[str, Any]] = None):
        self._log(LogType.DEBUG, service, operation, message, details)
    
    # Service-specific logging methods
    def log_model_loading(self, model_path: str, success: bool, details: Optional[Dict[str, Any]] = None):
        if success:
            self.success('MODEL', 'LOADING', f'Model loaded successfully from {model_path}', details)
        else:
            self.failed('MODEL', 'LOADING', f'Failed to load model from {model_path}', details)
    
    def log_prediction(self, image_url: str, success: bool, details: Optional[Dict[str, Any]] = None):
        if success:
            self.success('PREDICTION', 'INFERENCE', f'Prediction successful for {image_url}', details)
        else:
            self.failed('PREDICTION', 'INFERENCE', f'Prediction failed for {image_url}', details)
    
    def log_image_processing(self, operation: str, success: bool, details: Optional[Dict[str, Any]] = None):
        if success:
            self.success('IMAGE', operation, 'Image processing successful', details)
        else:
            self.failed('IMAGE', operation, 'Image processing failed', details)
    
    def log_api_request(self, method: str, endpoint: str, success: bool, details: Optional[Dict[str, Any]] = None):
        if success:
            self.success('API', f'{method} {endpoint}', 'API request successful', details)
        else:
            self.failed('API', f'{method} {endpoint}', 'API request failed', details)

class ColoredFormatter(logging.Formatter):
    def format(self, record):
        # Use the custom formatting from the message itself
        return record.getMessage()

# Global logger instance
colored_logger = ColoredLogger()
