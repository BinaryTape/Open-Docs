[//]: # (title: 보안)

당사는 제품에 보안 취약점이 없도록 최선을 다하고 있습니다. 취약점 발생 위험을 줄이기 위해 다음 모범 사례를 따를 수 있습니다:

* 항상 최신 Kotlin 릴리스를 사용하세요. 보안상의 이유로, [Maven Central](https://central.sonatype.com/search?q=g:org.jetbrains.kotlin)에 게시된 릴리스에 다음 PGP 키를 사용하여 서명합니다:

  * 키 ID: **kt-a@jetbrains.com**
  * 지문: **2FBA 29D0 8D2E 25EE 84C1 32C3 0729 A0AF F899 9A87**
  * 키 크기: **RSA 3072**

* 애플리케이션의 의존성(dependencies)은 최신 버전을 사용하세요. 특정 버전의 의존성을 사용해야 하는 경우, 주기적으로 새로운 보안 취약점이 발견되었는지 확인하세요. [GitHub의 가이드라인](https://docs.github.com/en/code-security)을 따르거나 [CVE 데이터베이스](https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=kotlin)에서 알려진 취약점을 찾아볼 수 있습니다.

발견하신 모든 보안 문제에 대해 적극적으로 듣고자 하며 감사하게 생각합니다. Kotlin에서 발견한 취약점을 보고하려면, 당사의 [이슈 트래커](https://youtrack.jetbrains.com/newIssue?project=KT&c=Type%20Security%20Problem)에 직접 메시지를 게시하시거나 [이메일](mailto:security@jetbrains.org)을 보내주세요.

당사의 책임 있는 공개 프로세스가 어떻게 작동하는지에 대한 더 자세한 정보는 [JetBrains Coordinated Disclosure Policy](https://www.jetbrains.com/legal/docs/terms/coordinated-disclosure/)를 확인해주세요.