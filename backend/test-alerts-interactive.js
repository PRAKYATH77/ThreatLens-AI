#!/usr/bin/env node

/**
 * ThreatLens Alert Generator - Test Suite
 * 
 * This script simulates real security vulnerabilities and generates alerts
 * Run this to test the alert system and see threats appear on the dashboard
 */

const axios = require('axios');
const readline = require('readline');

const API_BASE = 'http://127.0.0.1:5000/api';

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

const log = {
    info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => rl.question(prompt, resolve));
}

const tests = [
    {
        name: 'SQL Injection Attack',
        key: '1',
        description: 'Simulate SQL injection vulnerability - Critical severity',
        endpoint: '/test/sql-injection',
        icon: '🔓',
        payload: {
            payload: "' OR '1'='1' -- DROP TABLE users;"
        }
    },
    {
        name: 'XSS (Cross-Site Scripting)',
        key: '2',
        description: 'Simulate XSS vulnerability - High severity',
        endpoint: '/test/xss',
        icon: '⚡',
        payload: {
            payload: '<img src=x onerror="alert(\'XSS\')">'
        }
    },
    {
        name: 'Brute Force Attack',
        key: '3',
        description: 'Simulate brute force login attempt - High severity',
        endpoint: '/test/brute-force',
        icon: '🔨',
        payload: {
            attempts: 50
        }
    },
    {
        name: 'Reconnaissance/Scanning',
        key: '4',
        description: 'Simulate endpoint enumeration - Medium severity',
        endpoint: '/test/reconnaissance',
        icon: '🔍',
        payload: {
            endpoint_count: 25
        }
    },
    {
        name: 'Vulnerability Scanner Detection',
        key: '5',
        description: 'Simulate Nmap/vulnerability scanner - Medium severity',
        endpoint: '/test/scanner',
        icon: '📡',
        payload: {}
    },
    {
        name: 'Data Exfiltration Attempt',
        key: '6',
        description: 'Simulate unusual large data download - High severity',
        endpoint: '/test/data-exfiltration',
        icon: '💾',
        payload: {
            file_size_mb: 500
        }
    }
];

async function runTest(test) {
    try {
        log.info(`Triggering: ${test.name}`);
        
        const response = await axios.post(
            `${API_BASE}${test.endpoint}`,
            test.payload
        );

        if (response.data.success) {
            log.success(response.data.message);
            console.log(`   ${colors.cyan}Alert ID: ${response.data.alert._id}${colors.reset}`);
            
            if (response.data.tips && response.data.tips.length > 0) {
                console.log(`\n   ${colors.yellow}📚 Security Tips:${colors.reset}`);
                response.data.tips.forEach(tip => {
                    console.log(`   ${tip}`);
                });
            }
        }
    } catch (error) {
        log.error(`Failed to trigger alert: ${error.response?.data?.error || error.message}`);
    }
}

async function showMenu() {
    log.title('🛡️  ThreatLens Alert Generator');
    console.log(`${colors.bright}Generate real security alerts to test your dashboard${colors.reset}\n`);
    
    console.log('Available Tests:\n');
    tests.forEach(test => {
        console.log(`  ${test.key}. ${test.icon} ${colors.bright}${test.name}${colors.reset}`);
        console.log(`     ${test.description}`);
    });
    
    console.log(`\n  a. Run All Tests (sequential)`);
    console.log(`  r. Run Random Test`);
    console.log(`  q. Quit\n`);
    
    const choice = await question('Select option (1-6, a, r, or q): ');
    
    switch(choice.toLowerCase()) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
            const test = tests.find(t => t.key === choice);
            if (test) {
                await runTest(test);
            }
            break;
        
        case 'a':
            log.title('Running All Tests...');
            for (const test of tests) {
                await runTest(test);
                console.log('');
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
            }
            log.success('All tests completed!');
            break;
        
        case 'r':
            const randomTest = tests[Math.floor(Math.random() * tests.length)];
            log.title(`Running Random Test: ${randomTest.name}`);
            await runTest(randomTest);
            break;
        
        case 'q':
            console.log('\nGoodbye! 👋\n');
            rl.close();
            process.exit(0);
        
        default:
            log.warn('Invalid option. Please try again.');
    }
    
    // Show menu again
    console.log('\n' + '─'.repeat(50));
    await showMenu();
}

async function main() {
    console.clear();
    console.log(`${colors.bright}${colors.cyan}`);
    console.log(`
    ████████╗██╗  ██╗██████╗ ███████╗ █████╗ ████████╗██╗     ███████╗███╗   ██╗███████╗
    ╚══██╔══╝██║  ██║██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██║     ██╔════╝████╗  ██║██╔════╝
       ██║   ███████║██████╔╝█████╗  ███████║   ██║   ██║     █████╗  ██╔██╗ ██║███████╗
       ██║   ██╔══██║██╔══██╗██╔══╝  ██╔══██║   ██║   ██║     ██╔══╝  ██║╚██╗██║╚════██║
       ██║   ██║  ██║██║  ██║███████╗██║  ██║   ██║   ███████╗███████╗██║ ╚████║███████║
       ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝╚═╝  ╚═══╝╚══════╝
    `);
    console.log(`${colors.reset}${colors.bright}Alert Generator & Vulnerability Testing Tool${colors.reset}\n`);
    
    await showMenu();
}

main().catch(err => {
    log.error(`Fatal error: ${err.message}`);
    process.exit(1);
});
