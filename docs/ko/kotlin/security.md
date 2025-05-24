---
title: 보안
---
보안 취약점이 없는 제품을 만들기 위해 최선을 다하고 있습니다. 취약점 발생 위험을 줄이기 위해 다음 모범 사례를 따르세요.

* 항상 최신 Kotlin 릴리스를 사용하세요. 보안을 위해 [Maven Central](https://central.sonatype.com/search?q=g:org.jetbrains.kotlin)에 게시된 릴리스에 다음 PGP 키로 서명합니다.

  * Key ID: **kt-a@jetbrains.com**
  * Fingerprint: **2FBA 29D0 8D2E 25EE 84C1 32C3 0729 A0AF F899 9A87**
  * Key size: **RSA 3072**

* 애플리케이션 종속성의 최신 버전을 사용하세요. 특정 버전의 종속성을 사용해야 하는 경우 새로운 보안 취약점이 발견되었는지 주기적으로 확인하세요. [GitHub의 가이드라인](https://docs.github.com/en/code-security)을 따르거나 [CVE base](https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=kotlin)에서 알려진 취약점을 찾아볼 수 있습니다.

Kotlin에서 발견한 보안 문제에 대해 알려주시면 매우 감사하겠습니다. Kotlin에서 발견한 취약점을 보고하려면 [이슈 트래커](https://youtrack.jetbrains.com/newIssue?project=KT&c=Type%20Security%20Problem)에 직접 메시지를 게시하거나 [이메일](mailto:security@jetbrains.org)을 보내주세요.

책임 있는 공개 프로세스 작동 방식에 대한 자세한 내용은 [JetBrains Coordinated Disclosure Policy](https://www.jetbrains.com/legal/docs/terms/coordinated-disclosure/)를 확인하세요.