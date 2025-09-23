cmd_Release/rpiplc.node := ln -f "Release/obj.target/rpiplc.node" "Release/rpiplc.node" 2>/dev/null || (rm -rf "Release/rpiplc.node" && cp -af "Release/obj.target/rpiplc.node" "Release/rpiplc.node")
