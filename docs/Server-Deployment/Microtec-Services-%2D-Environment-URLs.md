🌐 Microtec Services - Environment URLs
=======================================

This document lists the service endpoints for all environments.

* * *

✅ Environment Overview
----------------------

| Environment | Purpose |
| --- | --- |
| **Local** | Developer machine testing |
| **Development** | Internal QA / integration |
| **Stage** | Pre-production validation |
| **Production** | Live customer environment |

* * *

🔗 Service Endpoints
--------------------

| Service / Environment | Local URL | Development URL | Stage URL | Production URL |
| --- | --- | --- | --- | --- |
| **Business Owner Portal** | [http://localhost:4301/bussiness-owners/](http://localhost:4301/bussiness-owners/) | [https://bo.microtec-test.com](https://bo.microtec-test.com/) | [https://bo.microtecstage.com/bussiness-owners/](https://bo.microtecstage.com/bussiness-owners/) | [https://bo.onlinemicrotec.com.sa/bussiness-owners](https://bo.onlinemicrotec.com.sa/bussiness-owners) |
| **Admin Portal** | [https://localhost:9090](http://localhost:4200/) | [https://adminclient.microtec-test.com](https://adminclient.microtecdev.com/) | [https://adminclient.microtecstage.com/](https://adminclient.microtecstage.com/) | _TBD_ |
| **ERP System** | [http://localhost:8080](http://localhost:8080/) | [https://*.microtec-test.com/erp](https://microtecdev.com:2050/erp) | https://*.microtecstage.com/erp | https://*.onlinemicrotec.com.sa/erp |
| 
| **Gateway API** | [http://localhost:5000](http://localhost:5000/) | [https://microtecsaudi.com:2032/](https://microtecsaudi.com:2032/) | [https://api.microtecstage.com](https://api.microtecstage.com/) | _TBD_ |

* * *

🔒 Production Access Notes
--------------------------

Production URLs will be shared **privately** and only with authorized personnel.

* * *

✅ Additional Notes
------------------

*   Stage: Used for testing before production
    
*   Development: Internal/dev testing environment
    
*   Production: Restricted access