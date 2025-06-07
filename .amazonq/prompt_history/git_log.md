commit 5bbabab0221a25ba86be1e72b5227d17c298525c
Author: Olivier Mansour <omansour@gmail.com>
Date:   Fri Jun 6 19:09:37 2025 +0200

    feat: implement modal-based HTTP code details display
    
    - Removed debug alerts and test button
    - Replaced right sidebar with modal dialog for HTTP code details
    - Modal displays comprehensive information:
      - HTTP code number and name
      - HTTP cat image (larger size in modal)
      - Detailed description from API
      - Category information
      - Link to MDN Web Docs
    - Improved user experience with modal overlay
    - Maintained all clickable functionality on headers and images
    - Single column layout for better card display
    - Modal is dismissible and properly sized
    
    The HTTP code cards are now clickable and display detailed
    information in a clean modal interface.

commit 32f4ff04667d91653353ea748014c0247afbb37d
Author: Olivier Mansour <omansour@gmail.com>
Date:   Fri Jun 6 18:48:31 2025 +0200

    debug: add test button and debugging for clickable HTTP code functionality
    
    - Added temporary test button to verify sidebar functionality works
    - Enhanced click handlers on both header and image elements
    - Added debugging alerts and console logs
    - Made both card headers and images clickable with pointer cursors
    - Investigating why click events may not be triggering properly
    
    This is a debugging commit to isolate the click handler issues.

commit 6b169f0c266bb166e3de412e496ff0d86056fe30
Author: Olivier Mansour <omansour@gmail.com>
Date:   Fri Jun 6 17:58:49 2025 +0200

    fix: implement clickable HTTP code images for sidebar functionality
    
    - Removed Info buttons as requested
    - Made HTTP code images clickable with cursor pointer
    - Added onClick handlers directly to image containers
    - Removed onCardClick prop that wasn't working with Cloudscape Cards
    - Images now have proper click handlers to trigger sidebar display
    - Maintained all sidebar functionality and API integration
    
    The HTTP code cards are now clickable through their images,
    providing a cleaner interface without separate Info buttons.

commit 8f2f4d1a52e232dfc3b9341ed6b1b0f8030216cc
Author: Olivier Mansour <omansour@gmail.com>
Date:   Fri Jun 6 17:36:29 2025 +0200

    refactor: remove Info buttons and make HTTP code cards directly clickable
    
    - Removed Info buttons from HTTP code cards for cleaner UI
    - Made entire HTTP code cards clickable to show sidebar information
    - Simplified card header to show only HTTP code and name
    - Removed unused imports (Button, ColumnLayout, SideNavigation)
    - Cards now trigger sidebar display on click instead of separate button
    - Maintains all sidebar functionality with more intuitive interaction
    
    Users can now click directly on any HTTP code card to view
    detailed information in the right sidebar.

commit 6ca9e9589bfd90535f273a92edb7fde891eee066
Author: Olivier Mansour <omansour@gmail.com>
Date:   Fri Jun 6 17:18:03 2025 +0200

    feat: implement HTTP code info sidebar with detailed information
    
    - Added Info buttons to each HTTP code card
    - Implemented right sidebar with detailed HTTP code information
    - Enhanced Lambda function with comprehensive HTTP code descriptions
    - Added responsive grid layout that adjusts when sidebar is open
    - Integrated with http_code_info Lambda to fetch detailed information
    - Display includes:
      - HTTP code name and number
      - Detailed description
      - Category (Informational, Success, Redirection, Client Error, Server Error)
      - HTTP cat image
      - Link to MDN Web Docs
    - Added proper CORS headers to Lambda function
    - Sidebar can be closed with close button
    - Works for all HTTP status codes (100-511)
    
    The application now provides comprehensive educational information
    about each HTTP status code in an intuitive sidebar interface.

commit f06260758f532743662ad93a7c48d8519942cb15
Author: Olivier Mansour <omansour@gmail.com>
Date:   Fri Jun 6 16:35:34 2025 +0200

    fix: display response body as raw code in /try-url
    
    - Replaced CodeEditor with styled <pre> element for better compatibility
    - Response body now displays as raw text with proper formatting
    - Added scrollable container with monospace font
    - Fixed issue where HTML responses weren't showing in Body tab
    - Users can now see complete HTTP response content as expected

commit 8c13b7c5f67e08058cd69ef1ec3bb3c74909aeab
Author: Olivier Mansour <omansour@gmail.com>
Date:   Fri Jun 6 16:17:53 2025 +0200

    fix: resolve CORS issues for /try-url functionality
    
    - Fixed config.json parsing to handle OpenTofu output format
    - Added comprehensive CORS support to Lambda functions
    - Added OPTIONS method and CORS headers to API Gateway
    - Updated Lambda functions to return proper CORS headers
    - Redeployed API Gateway with new CORS configuration
    
    The /try-url functionality now works correctly and displays:
    - HTTP status code
    - Response headers in table format
    - Response body content

commit d96f0234240a0d012aeaaa918cd3b2a4731e6300
Author: Olivier Mansour <omansour@gmail.com>
Date:   Fri Jun 6 10:45:13 2025 +0200

    feat: complete deployment of HTTP Codes Educational App with working Lambda functions and frontend

commit 4f06fd6ac60c7ee512915f58cb6806d82959de36
Author: Olivier Mansour <omansour@gmail.com>
Date:   Fri Jun 6 10:31:40 2025 +0200

    fix: resolve API Gateway deprecation warnings by using aws_api_gateway_stage resource

commit 8bd30a7de347bf75a8559274bfd9dacf938650ae
Author: Olivier Mansour <omansour@gmail.com>
Date:   Fri Jun 6 10:22:33 2025 +0200

    feat: complete OpenTofu deployment with working API Gateway and Lambda functions

commit cb0785d8c5c688a5d3380848eeb3a906a5a1a082
Author: Olivier Mansour <omansour@gmail.com>
Date:   Fri Jun 6 10:18:58 2025 +0200

    fix: update Lambda runtime to provided.al2023 and improve API Gateway deployment

commit 847a4de9ea18ee12051fd621ee3e103df4eee316
Author: Olivier Mansour <omansour@gmail.com>
Date:   Fri Jun 6 10:08:54 2025 +0200

    fix: correct Lambda zip file paths in OpenTofu configuration

commit b2ffe0e1853a933c2abed72a91b46cac7bec8f63
Author: Olivier Mansour <omansour@gmail.com>
Date:   Fri Jun 6 10:04:15 2025 +0200

    fix: resolve OpenTofu configuration issues and add missing variables

commit 52d23413c4c64e78b57ca79db1ec52d4013f6824
Author: Olivier Mansour <omansour@gmail.com>
Date:   Fri Jun 6 09:59:09 2025 +0200

    fix: remove duplicate main.tf files causing OpenTofu conflicts

commit ea0c7c1e3d85f58f36c64ab4059fc7836fcea3da
Author: Olivier Mansour <omansour@gmail.com>
Date:   Thu Jun 5 20:16:15 2025 +0200

    refactor: remove redundant frontend module after splitting into s3 and cloudfront modules

commit b929af3c57c74cadcf24a51bb9bc8c8c2a95f528
Author: Olivier Mansour <omansour@gmail.com>
Date:   Thu Jun 5 20:08:00 2025 +0200

    refactor: reorganize OpenTofu modules according to architecture rules

commit 6b3f27ee9b197d4e6e0c2be733d4dccc01053ccd
Author: Olivier Mansour <omansour@gmail.com>
Date:   Thu Jun 5 20:07:25 2025 +0200

    chore: remove unnecessary opentofu/.gitignore file

commit a9e8dcc88aa7c5b3a746737de0dd35fb37817d1f
Author: Olivier Mansour <omansour@gmail.com>
Date:   Thu Jun 5 19:53:23 2025 +0200

    refactor: reorganize OpenTofu files according to architecture rules

commit 869d92229650d9d17f0c4a0cca8bd65600a84ecc
Author: Olivier Mansour <omansour@gmail.com>
Date:   Thu Jun 5 19:44:23 2025 +0200

    docs: update build rules documentation

commit e997d8d6f9cdb688a7c1d2fa83c351f1406a1619
Author: Olivier Mansour <omansour@gmail.com>
Date:   Thu Jun 5 19:44:09 2025 +0200

    chore: add OpenTofu mock output and directory-specific gitignore

commit e2ee88dd2bb9d175cc1a36fb0a131b72e843e012
Author: Olivier Mansour <omansour@gmail.com>
Date:   Thu Jun 5 19:34:05 2025 +0200

    chore: add go.sum files for lambda dependencies

commit f558d333be0870ba5d84a7171df41944abfd376a
Author: Olivier Mansour <omansour@gmail.com>
Date:   Thu Jun 5 19:33:27 2025 +0200

    chore: update .gitignore to exclude package-lock.json and frontend build

commit 56676b4ac8b019d473b851c69507a281c932df39
Author: Olivier Mansour <omansour@gmail.com>
Date:   Thu Jun 5 19:21:21 2025 +0200

    fix: add GOPROXY=direct to Go build commands

commit 3dc38779d8372d08b976d5ffb4f72d2efd0c0736
Author: Olivier Mansour <omansour@gmail.com>
Date:   Thu Jun 5 19:02:13 2025 +0200

    fix: reduce npm warnings by adding overrides and npmrc configuration

commit 1c9db9bbba319cd3f70765637fa63c979b61343f
Author: Olivier Mansour <omansour@gmail.com>
Date:   Thu Jun 5 18:57:29 2025 +0200

    fix: resolve circular dependency in Makefile

commit 7fc77322b15979ecf060398ac4a2ee2bae6f52fe
Author: Olivier Mansour <omansour@gmail.com>
Date:   Thu Jun 5 18:52:11 2025 +0200

    fix: improve frontend build process with fallback for OpenTofu outputs

commit 73cac5c8dbf4212e84314a6c014d882f048d2c48
Author: Olivier Mansour <omansour@gmail.com>
Date:   Thu Jun 5 18:49:11 2025 +0200

    fix: update frontend dependencies to latest versions

commit f822d330d1bff34f3f6465a0937c67228cf56d5f
Author: Olivier Mansour <omansour@gmail.com>
Date:   Thu Jun 5 18:45:25 2025 +0200

    fix: add help target to Makefile and set as default

commit b7f60338b153759cbbac6e3c3f9074e678694a31
Author: Olivier Mansour <omansour@gmail.com>
Date:   Thu Jun 5 17:11:19 2025 +0200

    feat: initial project structure

commit 545019956e3811514e184bc18ae733e0046a66a1
Author: Olivier Mansour <omansour@gmail.com>
Date:   Thu Jun 5 17:10:24 2025 +0200

    feat(amazonq): project intro and context
