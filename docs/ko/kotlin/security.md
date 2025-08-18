[//]: # (title: 보안)

저희는 제품에 보안 취약점이 없도록 최선을 다하고 있습니다. 취약점이 발생할 위험을 줄이려면 다음 모범 사례를 따르십시오:

*   항상 최신 Kotlin 릴리스를 사용하십시오. 보안 목적으로, 저희는 [Maven Central](https://central.sonatype.com/search?q=g:org.jetbrains.kotlin)에 게시된 릴리스에 다음 PGP 키로 서명합니다:

    *   키 ID: **kt-a@jetbrains.com**
    *   지문: **2FBA 29D0 8D2E 25EE 84C1 32C3 0729 A0AF F899 9A87**
    *   키 크기: **RSA 3072**

*   애플리케이션 종속성의 최신 버전을 사용하십시오. 특정 버전의 종속성을 사용해야 하는 경우, 새로운 보안 취약점이 발견되었는지 주기적으로 확인하십시오. [GitHub 가이드라인](https://docs.github.com/en/code-security)을 따르거나 [CVE 데이터베이스](https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=kotlin)에서 알려진 취약점을 찾아볼 수 있습니다.

저희는 발견하시는 모든 보안 문제에 대해 매우 감사하게 생각하며 기꺼이 들을 준비가 되어 있습니다. Kotlin에서 발견하신 취약점을 보고하려면, 저희 [이슈 트래커](https://youtrack.jetbrains.com/newIssue?project=KT&c=Type%20Security%20Problem)에 직접 메시지를 게시하거나 [이메일](mailto:security@jetbrains.org)을 보내주십시오.

저희의 책임 있는 공개 프로세스가 어떻게 작동하는지에 대한 자세한 내용은 [JetBrains Coordinated Disclosure Policy](https://www.jetbrains.com/legal/docs/terms/coordinated-disclosure/)를 확인하십시오.