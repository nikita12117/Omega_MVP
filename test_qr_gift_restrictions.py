"""
QR Gift Ticket System Testing - New Restrictions
Tests the updated QR gift ticket system with:
- 7 ticket limit per demo account
- 12-hour time limit from activation
- Event name inheritance from parent token
"""

import requests
import json
from datetime import datetime

# Configuration
BACKEND_URL = "https://agent-forge-49.preview.emergentagent.com/api"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "cUtsuv-8nirbe-tippop"
PARENT_TOKEN = "OMEGA-2025-B20176"

# Global variables
admin_token = None
demo_token = None
test_results = []

def log_test(test_name, success, message, details=None):
    """Log test results"""
    result = {
        "test": test_name,
        "success": success,
        "message": message,
        "timestamp": datetime.now().isoformat()
    }
    if details:
        result["details"] = details
    test_results.append(result)
    
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} | {test_name}")
    print(f"   {message}")
    if details:
        print(f"   Details: {json.dumps(details, indent=2)}")
    print()

def admin_login():
    """Login as admin"""
    global admin_token
    
    endpoint = f"{BACKEND_URL}/auth/admin/login"
    payload = {
        "username": ADMIN_USERNAME,
        "password": ADMIN_PASSWORD
    }
    
    try:
        response = requests.post(endpoint, json=payload, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            admin_token = data.get("token")
            print(f"✅ Admin login successful\n")
            return True
        else:
            print(f"❌ Admin login failed: {response.status_code}\n")
            return False
    except Exception as e:
        print(f"❌ Admin login exception: {str(e)}\n")
        return False

def test_scenario_1_gifting_status():
    """
    Test Scenario 1: Check Gifting Status
    - Create a fresh demo account using token OMEGA-2025-B20176
    - Call GET /api/demo/gifting-status
    - Verify: can_gift=true, tickets_used=0, tickets_remaining=7, hours_remaining (should be close to 12)
    """
    global demo_token
    
    print("="*80)
    print("TEST SCENARIO 1: Check Gifting Status")
    print("="*80)
    
    # Step 1: Activate demo account with parent token
    activate_endpoint = f"{BACKEND_URL}/demo/activate"
    activate_payload = {"token": PARENT_TOKEN}
    
    try:
        response = requests.post(activate_endpoint, json=activate_payload, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            demo_token = data.get("token")
            user = data.get("user", {})
            
            log_test(
                "1.1 - Demo Account Activation",
                True,
                f"Demo account activated successfully with token {PARENT_TOKEN}",
                {
                    "user_name": user.get("name"),
                    "is_demo": user.get("is_demo"),
                    "demo_expires_at": user.get("demo_expires_at")
                }
            )
        else:
            log_test(
                "1.1 - Demo Account Activation",
                False,
                f"Failed to activate demo account: {response.status_code}",
                response.json() if response.text else None
            )
            return False
    except Exception as e:
        log_test("1.1 - Demo Account Activation", False, f"Exception: {str(e)}")
        return False
    
    # Step 2: Check gifting status
    status_endpoint = f"{BACKEND_URL}/demo/gifting-status"
    headers = {"Authorization": f"Bearer {demo_token}"}
    
    try:
        response = requests.get(status_endpoint, headers=headers, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            
            # Verify expected fields
            can_gift = data.get("can_gift")
            tickets_used = data.get("tickets_used")
            tickets_remaining = data.get("tickets_remaining")
            hours_remaining = data.get("hours_remaining")
            
            # Check if all values match expectations
            checks = {
                "can_gift": can_gift == True,
                "tickets_used": tickets_used == 0,
                "tickets_remaining": tickets_remaining == 7,
                "hours_remaining": hours_remaining is not None and 11.5 <= hours_remaining <= 12.0
            }
            
            all_passed = all(checks.values())
            
            log_test(
                "1.2 - Gifting Status Check",
                all_passed,
                f"Gifting status: can_gift={can_gift}, tickets_used={tickets_used}, tickets_remaining={tickets_remaining}, hours_remaining={hours_remaining}",
                {
                    "checks": checks,
                    "full_response": data
                }
            )
            
            return all_passed
        else:
            log_test(
                "1.2 - Gifting Status Check",
                False,
                f"Failed to get gifting status: {response.status_code}",
                response.json() if response.text else None
            )
            return False
    except Exception as e:
        log_test("1.2 - Gifting Status Check", False, f"Exception: {str(e)}")
        return False

def test_scenario_2_create_gift_ticket():
    """
    Test Scenario 2: Create Gift Ticket (Inherits Parent Event)
    - Using the same demo account
    - Call POST /api/demo/create-ticket
    - Verify response includes:
      - token format: DEMO-2025-XXXXXX
      - label contains parent event name
      - tickets_remaining: 6
      - hours_remaining: ~12
      - event_name matches parent
    """
    print("="*80)
    print("TEST SCENARIO 2: Create Gift Ticket (Inherits Parent Event)")
    print("="*80)
    
    # First, get the parent token's event name
    parent_event_name = None
    qr_tokens_endpoint = f"{BACKEND_URL}/admin/qr-tokens"
    headers_admin = {"Authorization": f"Bearer {admin_token}"}
    
    try:
        response = requests.get(qr_tokens_endpoint, headers=headers_admin, timeout=30)
        if response.status_code == 200:
            data = response.json()
            tokens = data.get("tokens", [])
            for token in tokens:
                if token.get("token") == PARENT_TOKEN:
                    parent_label = token.get("label", "")
                    # Extract event name from label (format: "Event Name - Ticket #X")
                    if " - Ticket #" in parent_label:
                        parent_event_name = parent_label.split(" - Ticket #")[0]
                    else:
                        parent_event_name = parent_label
                    break
            
            log_test(
                "2.1 - Get Parent Token Event Name",
                parent_event_name is not None,
                f"Parent token event name: {parent_event_name}",
                {"parent_label": parent_label if parent_event_name else None}
            )
    except Exception as e:
        log_test("2.1 - Get Parent Token Event Name", False, f"Exception: {str(e)}")
        parent_event_name = "Unknown"
    
    # Create gift ticket
    create_endpoint = f"{BACKEND_URL}/demo/create-ticket"
    headers = {"Authorization": f"Bearer {demo_token}"}
    
    try:
        response = requests.post(create_endpoint, headers=headers, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            
            # Verify expected fields
            token = data.get("token")
            label = data.get("label")
            event_name = data.get("event_name")
            tickets_remaining = data.get("tickets_remaining")
            hours_remaining = data.get("hours_remaining")
            
            # Check token format
            token_format_ok = token and token.startswith("DEMO-2025-")
            
            # Check if event name matches parent
            event_matches = event_name == parent_event_name if parent_event_name != "Unknown" else True
            
            # Check if label contains event name
            label_contains_event = parent_event_name in label if parent_event_name != "Unknown" else True
            
            # Check tickets_remaining
            tickets_ok = tickets_remaining == 6
            
            # Check hours_remaining
            hours_ok = hours_remaining is not None and 11.5 <= hours_remaining <= 12.0
            
            checks = {
                "token_format": token_format_ok,
                "event_name_matches_parent": event_matches,
                "label_contains_event": label_contains_event,
                "tickets_remaining": tickets_ok,
                "hours_remaining": hours_ok
            }
            
            all_passed = all(checks.values())
            
            log_test(
                "2.2 - Create Gift Ticket",
                all_passed,
                f"Gift ticket created: token={token}, label={label}, event={event_name}, tickets_remaining={tickets_remaining}, hours_remaining={hours_remaining}",
                {
                    "checks": checks,
                    "parent_event_name": parent_event_name,
                    "full_response": data
                }
            )
            
            return all_passed, data
        else:
            log_test(
                "2.2 - Create Gift Ticket",
                False,
                f"Failed to create gift ticket: {response.status_code}",
                response.json() if response.text else None
            )
            return False, None
    except Exception as e:
        log_test("2.2 - Create Gift Ticket", False, f"Exception: {str(e)}")
        return False, None

def test_scenario_3_ticket_limit():
    """
    Test Scenario 3: Check 7 Ticket Limit
    - Using same demo account, create 6 more tickets (total 7)
    - Verify each succeeds with decreasing tickets_remaining
    - Attempt to create 8th ticket
    - Should fail with 403 and message about limit reached
    """
    print("="*80)
    print("TEST SCENARIO 3: Check 7 Ticket Limit")
    print("="*80)
    
    create_endpoint = f"{BACKEND_URL}/demo/create-ticket"
    headers = {"Authorization": f"Bearer {demo_token}"}
    
    # We already created 1 ticket in scenario 2, so create 6 more
    for i in range(2, 8):  # Tickets 2-7
        try:
            response = requests.post(create_endpoint, headers=headers, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                tickets_remaining = data.get("tickets_remaining")
                expected_remaining = 7 - i
                
                tickets_ok = tickets_remaining == expected_remaining
                
                log_test(
                    f"3.{i} - Create Ticket #{i}",
                    tickets_ok,
                    f"Ticket #{i} created. tickets_remaining={tickets_remaining} (expected: {expected_remaining})",
                    {"token": data.get("token"), "label": data.get("label")}
                )
            else:
                log_test(
                    f"3.{i} - Create Ticket #{i}",
                    False,
                    f"Failed to create ticket #{i}: {response.status_code}",
                    response.json() if response.text else None
                )
                return False
        except Exception as e:
            log_test(f"3.{i} - Create Ticket #{i}", False, f"Exception: {str(e)}")
            return False
    
    # Now try to create the 8th ticket (should fail)
    try:
        response = requests.post(create_endpoint, headers=headers, timeout=30)
        
        if response.status_code == 403:
            data = response.json()
            detail = data.get("detail", "")
            
            # Check if error message mentions limit
            limit_mentioned = "limit" in detail.lower() or "7" in detail
            
            log_test(
                "3.8 - Create Ticket #8 (Should Fail)",
                limit_mentioned,
                f"Correctly rejected 8th ticket with 403. Message: {detail}",
                {"status_code": 403, "detail": detail}
            )
            
            return limit_mentioned
        else:
            log_test(
                "3.8 - Create Ticket #8 (Should Fail)",
                False,
                f"Expected 403 but got {response.status_code}",
                response.json() if response.text else None
            )
            return False
    except Exception as e:
        log_test("3.8 - Create Ticket #8 (Should Fail)", False, f"Exception: {str(e)}")
        return False

def test_scenario_4_event_inheritance():
    """
    Test Scenario 4: Verify Event Name Inheritance
    - Check that all demo-created tickets have the same event name as the parent token
    - NOT the current admin event name
    """
    print("="*80)
    print("TEST SCENARIO 4: Verify Event Name Inheritance")
    print("="*80)
    
    # Get parent token's event name
    parent_event_name = None
    qr_tokens_endpoint = f"{BACKEND_URL}/admin/qr-tokens"
    headers_admin = {"Authorization": f"Bearer {admin_token}"}
    
    try:
        response = requests.get(qr_tokens_endpoint, headers=headers_admin, timeout=30)
        if response.status_code == 200:
            data = response.json()
            tokens = data.get("tokens", [])
            for token in tokens:
                if token.get("token") == PARENT_TOKEN:
                    parent_label = token.get("label", "")
                    if " - Ticket #" in parent_label:
                        parent_event_name = parent_label.split(" - Ticket #")[0]
                    else:
                        parent_event_name = parent_label
                    break
    except Exception as e:
        log_test("4.1 - Get Parent Event Name", False, f"Exception: {str(e)}")
        return False
    
    if not parent_event_name:
        log_test("4.1 - Get Parent Event Name", False, "Could not find parent token")
        return False
    
    log_test(
        "4.1 - Get Parent Event Name",
        True,
        f"Parent event name: {parent_event_name}"
    )
    
    # Get current admin event name
    current_event_endpoint = f"{BACKEND_URL}/current-event"
    try:
        response = requests.get(current_event_endpoint, headers=headers_admin, timeout=30)
        if response.status_code == 200:
            data = response.json()
            admin_event_name = data.get("event_name")
            
            log_test(
                "4.2 - Get Current Admin Event Name",
                True,
                f"Current admin event name: {admin_event_name}"
            )
    except Exception as e:
        log_test("4.2 - Get Current Admin Event Name", False, f"Exception: {str(e)}")
        admin_event_name = None
    
    # Get all demo-created tickets
    my_tickets_endpoint = f"{BACKEND_URL}/demo/my-tickets"
    headers = {"Authorization": f"Bearer {demo_token}"}
    
    try:
        response = requests.get(my_tickets_endpoint, headers=headers, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            tickets = data.get("tickets", [])
            
            # Check each ticket's event name
            all_match_parent = True
            none_match_admin = True
            
            for ticket in tickets:
                label = ticket.get("label", "")
                # Extract event name from label
                if " - " in label:
                    ticket_event = label.split(" - ")[0]
                    
                    if ticket_event != parent_event_name:
                        all_match_parent = False
                    
                    if admin_event_name and ticket_event == admin_event_name:
                        none_match_admin = False
            
            log_test(
                "4.3 - Verify Event Name Inheritance",
                all_match_parent and none_match_admin,
                f"All {len(tickets)} demo tickets inherit parent event name '{parent_event_name}' (not admin event '{admin_event_name}')",
                {
                    "all_match_parent": all_match_parent,
                    "none_match_admin": none_match_admin,
                    "parent_event": parent_event_name,
                    "admin_event": admin_event_name,
                    "ticket_count": len(tickets)
                }
            )
            
            return all_match_parent and none_match_admin
        else:
            log_test(
                "4.3 - Verify Event Name Inheritance",
                False,
                f"Failed to get demo tickets: {response.status_code}",
                response.json() if response.text else None
            )
            return False
    except Exception as e:
        log_test("4.3 - Verify Event Name Inheritance", False, f"Exception: {str(e)}")
        return False

def test_scenario_5_admin_quick_ticket():
    """
    Test Scenario 5: Admin Quick Ticket
    - Login as admin
    - Call POST /api/admin/quick-ticket
    - Verify it uses current admin event name (not demo parent event)
    """
    print("="*80)
    print("TEST SCENARIO 5: Admin Quick Ticket")
    print("="*80)
    
    # Get current admin event name
    current_event_endpoint = f"{BACKEND_URL}/current-event"
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    try:
        response = requests.get(current_event_endpoint, headers=headers, timeout=30)
        if response.status_code == 200:
            data = response.json()
            admin_event_name = data.get("event_name")
            
            log_test(
                "5.1 - Get Current Admin Event Name",
                True,
                f"Current admin event name: {admin_event_name}"
            )
        else:
            log_test(
                "5.1 - Get Current Admin Event Name",
                False,
                f"Failed to get current event: {response.status_code}"
            )
            return False
    except Exception as e:
        log_test("5.1 - Get Current Admin Event Name", False, f"Exception: {str(e)}")
        return False
    
    # Create admin quick ticket
    quick_ticket_endpoint = f"{BACKEND_URL}/admin/quick-ticket"
    
    try:
        response = requests.post(quick_ticket_endpoint, headers=headers, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            
            token = data.get("token")
            label = data.get("label")
            event_name = data.get("event_name")
            
            # Check token format
            token_format_ok = token and token.startswith("OMEGA-2025-")
            
            # Check if event name matches current admin event
            event_matches_admin = event_name == admin_event_name
            
            # Check if label contains admin event name
            label_contains_admin_event = admin_event_name in label
            
            checks = {
                "token_format": token_format_ok,
                "event_name_matches_admin": event_matches_admin,
                "label_contains_admin_event": label_contains_admin_event
            }
            
            all_passed = all(checks.values())
            
            log_test(
                "5.2 - Create Admin Quick Ticket",
                all_passed,
                f"Admin quick ticket created: token={token}, label={label}, event={event_name}",
                {
                    "checks": checks,
                    "admin_event_name": admin_event_name,
                    "full_response": data
                }
            )
            
            return all_passed
        else:
            log_test(
                "5.2 - Create Admin Quick Ticket",
                False,
                f"Failed to create admin quick ticket: {response.status_code}",
                response.json() if response.text else None
            )
            return False
    except Exception as e:
        log_test("5.2 - Create Admin Quick Ticket", False, f"Exception: {str(e)}")
        return False

def print_summary():
    """Print test summary"""
    print("\n" + "="*80)
    print("TEST SUMMARY - QR GIFT TICKET RESTRICTIONS")
    print("="*80)
    
    total = len(test_results)
    passed = sum(1 for r in test_results if r["success"])
    failed = total - passed
    
    print(f"\nTotal Tests: {total}")
    print(f"Passed: {passed} ✅")
    print(f"Failed: {failed} ❌")
    print(f"Success Rate: {(passed/total*100):.1f}%\n")
    
    if failed > 0:
        print("Failed Tests:")
        for result in test_results:
            if not result["success"]:
                print(f"  ❌ {result['test']}")
                print(f"     {result['message']}")
    
    print("\n" + "="*80)

def main():
    """Run all test scenarios"""
    print("="*80)
    print("QR GIFT TICKET SYSTEM TESTING - NEW RESTRICTIONS")
    print("="*80)
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Parent Token: {PARENT_TOKEN}")
    print(f"Timestamp: {datetime.now().isoformat()}")
    print("="*80 + "\n")
    
    # Admin login
    if not admin_login():
        print("❌ CRITICAL: Admin login failed. Cannot proceed.\n")
        return
    
    # Run test scenarios
    test_scenario_1_gifting_status()
    test_scenario_2_create_gift_ticket()
    test_scenario_3_ticket_limit()
    test_scenario_4_event_inheritance()
    test_scenario_5_admin_quick_ticket()
    
    # Print summary
    print_summary()
    
    # Save results to file
    with open("/app/qr_gift_test_results.json", "w") as f:
        json.dump(test_results, f, indent=2)
    print(f"\nDetailed results saved to: /app/qr_gift_test_results.json\n")

if __name__ == "__main__":
    main()
