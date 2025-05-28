# 貢獻

如果您想為此專案貢獻程式碼，您可以透過 GitHub 派生儲存庫並提交提取請求來達成。

提交程式碼時，請盡力遵循現有的慣例和風格，以使程式碼盡可能保持可讀性。

在您的程式碼被專案接受之前，您還必須簽署 [個人貢獻者許可協議 (CLA)][1]。

 [1]: https://spreadsheets.google.com/spreadsheet/viewform?formkey=dDViT2xzUHAwRkI3X3k5Z0lQM091OGc6MQ&ndplr=1
 
## SQLDelight 

如果您正尋求開始貢獻，請參考下方根據您想貢獻的 SQLDelight 部分而定的特定指南。如果您仍然不確定，請在您正在查看的問題中留言，說明您卡在哪裡，我們將在那裡回覆——或者為您正在嘗試做的事情建立一個問題並開始討論。

### IDE 外掛

如果您想修復錯誤或擴展 IDE，程式碼變更很可能會發生在 `sqldelight-idea-plugin` 模組中。您可以使用 `./gradlew runIde` 任務測試您的變更，並使用 `./gradlew runIde --debug-jvm` 進行即時偵錯。

如果您在 IDE 中遇到錯誤但無法在範例專案中重現，您可以即時偵錯您的 IDE。您將需要第二個 IntelliJ 安裝來執行此操作。您可以透過捲動到 IDE 列表底部並選擇不同版本的 IntelliJ 來使用 [Toolbox](https://www.jetbrains.com/toolbox-app/) 完成此操作。

在您想使用偵錯器的 IDE 中，檢出 SQLDelight 儲存庫，然後建立一個新的 `Remote` 執行配置。它將自動填入「遠端 JVM 的命令列引數」，類似於 `-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005`。複製該值，然後開啟您想偵錯的 IDE。選擇 `Help -> Edit Custom VM Options`，然後將您複製的行貼到打開的檔案底部。重新啟動您想偵錯的 IDE，然後一旦它啟動，開啟您建立配置的 IDE，並使用您建立的遠端配置附加偵錯器。

有關構建 IDE 外掛及其功能的更多資訊，請參閱 [Jetbrains 官方文件](https://jetbrains.org/intellij/sdk/docs/reference_guide/custom_language_support.html) 或加入 [Jetbrains 平台 Slack](https://blog.jetbrains.com/platform/2019/10/introducing-jetbrains-platform-slack-for-plugin-developers/)。

### 驅動程式

如果您有興趣建立自己的驅動程式，您可以在 SQLDelight 儲存庫之外使用 `runtime` 構件來達成。為了測試驅動程式，您可以依賴 `driver-test` 並擴展 `DriverTest` 和 `TransactionTest` 以確保它如 SQLDelight 所期望地運作。

#### 非同步驅動程式

可以透過使用 `runtime-async` 構件來實現進行非同步呼叫的驅動程式。

### Gradle

如果您遇到 Gradle 問題，請先在 `sqldelight-gradle-plugin/src/test` 中建立一個類似於其他資料夾的測試夾具，以重現您的問題。如果您不知道如何修復，請隨時只開啟一個帶有此失敗測試的 PR！測試案例深受感謝。整合測試展示了如何設置一個完整的 Gradle 專案，該專案將運行 SQLite/MySQL/PostgreSQL/等等，並使用其各自的執行時環境和 SQLDelight 執行 SQL 查詢。如果您在 SQLDelight 中遇到執行時問題，請考慮在這些現有的整合測試中新增測試。

### 編譯器

SQLDelight 的編譯器有多個層次——如果您嚴格只對程式碼生成 (而非 SQL 解析) 感興趣，那麼您將需要在 `sqldelight-compiler` 模組中進行貢獻。如果您對解析器感興趣，則需要貢獻到 [sql-psi](https://github.com/alecstrong/sql-psi)。SQLDelight 使用 [kotlinpoet](https://github.com/square/kotlinpoet) 生成 Kotlin 程式碼，請務必使用其 API 來參照 Kotlin 類型，以便匯入仍然正確運作。如果您以任何方式修改程式碼生成，請在開啟提取請求之前運行 `./gradlew build`，因為它會更新 `sqldelight-compiler:integration-tests` 中的整合測試。如果您想編寫整合測試 (意味著在執行時環境中運行 SQL 查詢)，請將測試添加到 `sqldelight-compiler:integration-tests`。

---

## SQL PSI

在下一節中，我們將介紹如何為解析器和 PSI 層貢獻，但在那之前，您應該閱讀一篇關於 [多種變體](https://www.alecstrong.com/posts/multiple-dialects/) 的部落格文章，以了解 [sql-psi](https://github.com/AlecStrong/sql-psi) 中的各個活動組件。與 SQLDelight 一樣，如果您遇到問題但不知道如何貢獻修復或需要協助，請在 GitHub 問題中留言或建立一個新問題來開始討論。

對於 SQL-PSI 中的任何變更，您將需要在對應的 `core/src/test/fixtures_*` 資料夾中新增一個測試夾具。`fixtures` 資料夾 (無尾碼) 適用於所有變體。在您的變更合併到 sql-psi 後，如果 SQLDelight 中也需要進行變更，請在 SQLDelight 上檢出 `sql-psi-dev` 分支並將您的 PR 目標指向它。它使用 sql-psi 的快照版本，因此您可以在 sql-psi 變更合併後大約 10 分鐘內構建您的 SQLDelight 變更。

### 語法

如果您要新增到語法中，首先決定這是一個您要新增到現有語法中的新規則，還是您想從 ANSI SQL (位於 [sql.bnf](https://github.com/AlecStrong/sql-psi/blob/master/core/src/main/kotlin/com/alecstrong/sql/psi/core/sql.bnf)) 中覆寫的規則。在這兩種情況下，您都將在您的新語法中定義該規則，但在覆寫 ANSI SQL 規則的情況下，將其添加到覆寫列表中並在規則上設定覆寫屬性：

```bnf
overrides ::= my_rule

my_rule ::= SOME_TOKEN {
  override = true
}
```

您的規則定義應以從 ANSI-SQL 中精確複製/貼上的規則開始。為了參照來自 ANSI-SQL 的規則，您需要將其用 {} 包圍，因此您應該將覆寫規則中的所有外部規則用 {} 包圍：

```bnf
my_rule ::= internal_rule {external_rule} {
  override = true
}
internal_rule ::= SOME_TOKEN
```

一個注意事項是，參照 ANSI-SQL 中的 `expr` 規則應看起來像 `<<expr '-1'>>`，因為它是特殊的且不能被覆寫。

任何您想從 ANSI SQL 使用的 Token 也應手動匯入：

```bnf
{
  parserImports = [
    "static com.alecstrong.sql.psi.core.psi.SqlTypes.DELETE"
    "static com.alecstrong.sql.psi.core.psi.SqlTypes.FROM"
  ]
}
overrides ::= delete

delete ::= DELETE FROM {table_name} {
  override = true
}
```

變體不能新增自己的 Token，但您可以透過用 "" 包圍來要求精確文字：

```bnf
my_rule ::= "SOME_TOKEN"
```

覆寫規則仍然必須生成符合原始規則類型的程式碼，因此請務必 `實作` 和 `擴展` 原始規則的現有類型：

```bnf
my_rule ::= internal_rule {external_rule} {
  extends = "com.alecstrong.sql.psi.core.psi.impl.SqlMyRuleImpl"
  implements = "com.alecstrong.sql.psi.core.psi.SqlMyRule"
  overrides = true
}
```

要查看語法中覆寫規則的範例，請查看 [此 PR](https://github.com/AlecStrong/sql-psi/pull/163/files)，它為 PostgreSQL 新增了 `RETURNING` 語法。

### 規則行為

通常，您想修改 PSI 層的行為 (例如，對於您希望編譯失敗的情況拋出錯誤)。為此，讓您的規則使用 `mixin` 而不是 `extends`，`mixin` 是一個您編寫的包含該新邏輯的類別：

```bnf
my_rule ::= interal_rule {external_rule} {
  mixin = "com.alecstrong.sql.psi.MyRuleMixin"
  implements = "com.alecstrong.sql.psi.core.psi.SqlMyRule"
  overrides = true
}
```

然後在該類別中確保它實作了原始 ANSI SQL 類型和 SQL-PSI 基類 `SqlCompositeElementImpl`：

```
class MyRule(
  node: ASTNode
) : SqlCompositeElementImpl(node),
    SqlMyRule {
  fun annotate(annotationHolder: SqlAnnotationHolder) {
    if (internal_rule.text == "bad_text") {
      annotationHolder.createErrorAnnotation("Invalid text value", internal_rule)
    }
  }
}
```

例如，[DropIndexMixin](https://github.com/AlecStrong/sql-psi/blob/f1137ff82dd0aa77f741a09d88855fbf9b751c00/core/src/main/kotlin/com/alecstrong/sql/psi/core/psi/mixins/DropIndexMixin.kt) 驗證正在刪除的索引是否存在於 schema 中。

---

如果您有關於貢獻的問題未在此文件中涵蓋，請隨時在 SqlDelight 上開啟一個問題或開啟一個 PR，以便我們可以努力改進它！