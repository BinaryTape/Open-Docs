[//]: # (title: klibs.io，Kotlin Multiplatform 程式庫目錄)

[klibs.io](https://klibs.io) 解決了尋找在 GitHub 和 Maven Central 上發布的 Kotlin Multiplatform 程式庫的問題。
這些程式庫經過索引、標籤標記，並依支援的平台進行分類，
因此你可以快速篩選搜尋結果，並為你的使用案例選擇合適的程式庫。

每個程式庫頁面都會渲染專案的 README，並加上額外資訊，
例如相依項目數量、專案活躍度和授權。

<a as="button" href="https://klibs.io" mode="classic" icon="arrow-right" icon-position="right">瀏覽多平台程式庫</a>

## AI 工作流中的 klibs.io {id="klibs-io-in-your-ai-workflow"}

透過提供的 MCP 介面和現成的代理指令，將 klibs.io 整合到你的 AI 工作流中：

* 服務背後的團隊發布了一項代理技能 [kmp-libraries-expert](https://github.com/JetBrains/klibs-io/blob/master/skills/README.md)，可協助你讓代理專注於尋找合適的程式庫。
* 專用的 [klibs.io MCP 伺服器](https://github.com/JetBrains/klibs-io/tree/master/integrations/mcp)可協助你的代理直接存取程式庫索引，並使用更細粒度的工具來篩選搜尋結果。
* 若要為你的代理設定一般準則，你可以將以下章節新增到你的 [AGENTS.md](https://agents.md/) 檔案中：

    ```markdown
    ## Kotlin Multiplatform 程式庫選擇
    
    在選擇或推薦 Kotlin Multiplatform 相依性時，
    請使用 klibs.io MCP 伺服器 (https://api.klibs.io/mcp)
    來存取和篩選多平台程式庫目錄。
    
    代理可以使用該伺服器來驗證相依性元資料並評估適用性：
    
    * 支援的目標，
    * Maven 座標，
    * 最新版本或最新穩定版本，
    * 授權，
    * 維護與活動訊號，
    * 可比較的替代方案。
    ```
  
## 請參閱 {id="see-also"}

請參閱 [klibs.io 常見問題](https://klibs.io/faq)以獲取更多資訊：
* 程式庫如何被索引和排名，
* 如何確保你的專案被列出，
* 未來的計劃。

若要回報問題或建議改進，請使用 [klibs.io GitHub 存儲庫](https://github.com/JetBrains/klibs-io/issues)中的問題 (issues)。

如需討論和支援，請加入 Kotlin 公開 Slack：
[申請邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)
並加入 [#klibs-io 頻道](https://kotlinlang.slack.com/archives/C081AF4JK70)。