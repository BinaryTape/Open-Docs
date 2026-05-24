[//]: # (title: 安全)

我们尽最大努力确保我们的产品没有安全漏洞。为了降低引入漏洞的风险，您可以遵循以下最佳做法： 

* 始终使用最新的 Kotlin 版本。出于安全目的，我们会使用以下 PGP 密钥对发布在 [Maven Central](https://central.sonatype.com/search?q=g:org.jetbrains.kotlin) 上的版本进行签名：

  * Key ID: **kt-a@jetbrains.com**
  * Fingerprint: **2FBA 29D0 8D2E 25EE 84C1 32C3 0729 A0AF F899 9A87**
  * Key size: **RSA 3072**

* 使用应用程序依赖项的最新版本。如果您需要使用特定版本的依赖项，请定期检查是否发现了任何新的安全漏洞。您可以遵循 [GitHub 的指南](https://docs.github.com/en/code-security) 或在 [CVE 库](https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=kotlin) 中浏览已知的漏洞。

从 Kotlin 2.4.0 开始，针对 JVM 的 Kotlin 标准库的每个版本线都有 18 个月的支持期。语言版本 (2._x_._0_) 和随后的工具版本 (2._x_._20_) 属于同一个版本线 (2._x_)。要了解更多关于我们如何处理 JVM 标准库中安全漏洞的信息，请参阅 [标准库安全支持](releases.md#standard-library-security-support)。

我们非常渴望并感激您反馈发现的任何安全问题。要报告您在 Kotlin 中发现的漏洞，请直接在我们的 [问题跟踪器](https://youtrack.jetbrains.com/newIssue?project=KT&c=Type%20Security%20Problem) 上发布消息或向我们发送 [电子邮件](mailto:security@jetbrains.org)。 

有关我们的负责任披露流程如何运作的更多信息，请查看 [JetBrains 协调披露政策](https://www.jetbrains.com/legal/docs/terms/coordinated-disclosure/)。