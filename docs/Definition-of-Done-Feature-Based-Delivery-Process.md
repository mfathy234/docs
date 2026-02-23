
**1. Ready**
------------

A feature may enter development only when the following conditions are met:
*   API Contract is reviewed and approved
    
*   Postman Collection is prepared
    
*   Test Cases are reviewed and approved
    
*   Backend and Frontend tasks are created and clearly defined on the board
    

* * *

**2. In Development**
---------------------

*   Backend and Frontend subtasks are created under the same Feature
    
*   Development work follows defined WIP limits
    
*    **WIP Limit** based on the number of Developers
    

* * *

**3. Code Review**
------------------

All development work must pass through Code Review:
*   Pull Request (PR) must be created
    
*   Reviewer assignment is **mandatory**
    
*   WIP Limit for Code Review column **= 6**
    
*   PR must be approved before merging
    

* * *

**4. Dev Deployment**
---------------------

A  task is considered Dev Deployed only when:
*   PR is approved
    
*   Merge is completed
    
*   Build succeeds
    
*   Deployment pipeline succeeds on Dev environment
    

* * *

**5. Backend Ready for Testing**
--------------------------------

Entry Criteria:
*   Backend is successfully deployed on Dev
    
*   API endpoints are available and accessible
    
The tester begins API validation using Postman.

* * *

**6. Backend Tested**
---------------------

The backend is considered tested only when:
*   API is validated against the approved contract

*   No breaking changes were introduced without contract approval

    
*   No Critical bugs exist
    
*   Happy Path scenario is fully functional
    

* * *

**7. Ready for Integration**
----------------------------

Entry Criteria:
*   Backend is fully tested
    
*   Frontend is deployed on Dev
    
The feature is now eligible for integration.

* * *

**8. Ready for End-to-End (E2E) Testing**
-----------------------------------------

*   Integration between Backend and Frontend is completed
    
*   Latest Dev deployment includes both components
    
The tester begins full feature validation.

* * *

**9. Done**
-----------

A feature is considered Done to be moved to stage only when:
*   API Testing is completed
    
*   End-to-End Testing is completed
    
*   No open Critical or blocking bugs exist
    
*   The feature is stable on the Dev environment
    

* * *

**Governance Rule**
===================

A feature cannot move to the next stage unless all entry conditions of the current stage are satisfied.
