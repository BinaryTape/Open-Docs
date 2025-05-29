[//]: # (title: 安全)

我们尽力确保我们的产品没有安全漏洞。为降低引入漏洞的风险，您可以遵循以下最佳实践：

*   始终使用最新的 Kotlin 版本。为安全起见，我们在 [Maven Central](https://central.sonatype.com/search?q=g:org.jetbrains.kotlin) 上发布的版本均使用以下 PGP 密钥签名：

    *   Key ID: **kt-a@jetbrains.com**
    *   指纹: **2FBA 29D0 8D2E 25EE 84C1 32C3 0729 A0AF F899 9A87**
    *   密钥大小: **RSA 3072**

*   使用应用程序依赖项的最新版本。如果您需要使用某个特定版本的依赖项，请定期检查是否发现了新的安全漏洞。您可以遵循 [GitHub 上的指南](https://docs.github.com/en/code-security)，或在 [CVE 数据库](https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=kotlin) 中浏览已知漏洞。

我们非常渴望并感谢您报告任何发现的安全问题。要报告您在 Kotlin 中发现的漏洞，请直接在我们的 [问题跟踪器](https://youtrack.jetbrains.com/newIssue?project=KT&c=Type%20Security%20Problem) 中发布消息，或向我们发送[电子邮件](mailto:security@jetbrains.org)。

有关我们的负责任披露流程如何运作的更多信息，请查看 [JetBrains 协调披露政策](https://www.jetbrains.com/legal/docs/terms/coordinated-disclosure/)。