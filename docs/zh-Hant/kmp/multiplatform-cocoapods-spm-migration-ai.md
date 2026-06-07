[//]: # (title: 使用 Junie 將 Kotlin 多平台專案從 CocoaPods 切換至 SwiftPM 相依性)
<primary-label ref="alpha"/>

如果您有一個帶有 CocoaPods 相依性的 KMP 模組，並希望使用 [SwiftPM 匯入](multiplatform-spm-import.md)切換至 Swift 封裝，
您可以使用 AI 來協助您。
本指南將展示如何使用 Junie 和 Kotlin AI 技能來簡化此流程。

> 雖然本指南使用 Junie，但您可以使用任何具備 [Kotlin AI 技能](https://kotlinlang.org/docs/kotlin-ai-skills.html) 的 AI 工具
> 來完成此過程。
> 
{style="tip"}

與所有 AI 工具一樣，Junie 可能會出錯。
如果您偏好手動遷移，請參閱[將 Kotlin 多平台專案從 CocoaPods 切換至 SwiftPM 相依性](multiplatform-cocoapods-spm-migration.md)。

## 設定 Junie CLI

在終端中，安裝 Junie CLI：

```bash
curl -fsSL https://junie.jetbrains.com/install.sh | bash
```

首次啟動 Junie CLI 以使用您的 JetBrains 帳戶登入
或使用外部 LLM：

```bash
junie
```

![Junie CLI 登入提示](cocoapods-spm-junie-login.png){width="500"}

參閱 Junie 文件以進一步了解 [認證選項](https://junie.jetbrains.com/docs/junie-cli.html#step-3-authenticate)。

## 安裝 AI 技能

在終端中，導覽至您的專案目錄並安裝相對應的 Kotlin AI 技能：
<!-- Stable Junie CLI will support extensions soon https://junie.jetbrains.com/docs/junie-cli-extensions.html -->

```shell
npx skills add Kotlin/kotlin-agent-skills
```

> 您需要 5.2.0 或更新版本的 npm 才能執行此指令。
> 
{style="note"}

在對話方塊中，選擇 `kotlin-tooling-cocoapods-spm-migration` 技能，並選擇 Junie 作為安裝該技能的代理 (agent)。
當系統詢問作用域時，選擇 `Project` 以將技能的作用域限制在您目前的專案中。

## 開始遷移

在開始之前，請確保您的專案正在使用 VCS，例如 Git。
這非常重要，以便您可以檢查從初始狀態開始以及每次迭代後的變更。

1. 打開終端並導覽至您的專案目錄。
2. 輸入以下指令以在互動模式下啟動 Junie：

    ```shell
    junie
    ```

3. 輸入以下提示詞：

    ```text
    Migrate <project-name> from CocoaPods to SwiftPM
    ```
   
Junie 會識別出您安裝的技能適用於該任務，並開始遷移流程。

## 檢查並測試變更

在專案 Git 記錄中檢查 Junie 所做的所有變更。
使用您的 Git 用戶端的 side-by-side diff 檢視器來輕鬆檢查所做的變更。
例如，在 IntelliJ IDEA 中：

![針對 CocoaPods 相依程式碼所做變更的 side-by-side diff](cocoapods-spm-junie-diff.png)

成功的遷移會修改：
* 相依於 CocoaPods 的模組中的 `build.gradle.kts` 檔案：`cocoapods {}` 區塊應被替換為
  `swiftPMDependencies {}` 區塊。
* 包含匯入指示詞的 Kotlin 檔案，這些指示詞參照了 CocoaPods API，並將其替換為 SwiftPM API 匯入。

測試您的專案是否像以前一樣正常執行。
如果您遇到問題，請檢查記錄中的錯誤訊息並要求 Junie 解決它們。
如果您無法自行解決問題，請在 [Slack](https://kotlinlang.slack.com/archives/C8CFFCVAB) 尋求支援。

> 若要監控您的配額消耗，請在 Junie 的互動模式下執行 `/usage` 指令。
> 
{style="tip"}

## 接下來

* 查看這些範例專案，它們在 `main` 分支中使用 CocoaPods，而在 `spm-import` 分支中使用 SwiftPM：
    * [Firebase 範例](https://github.com/Kotlin/kmp-with-cocoapods-firebase-sample/)
    * [Compose 多平台範例](https://github.com/Kotlin/kmp-with-cocoapods-compose-sample/)
* 了解：
    * [Swift 封裝匯出設定](multiplatform-spm-export.md)
    * [將 Swift 封裝作為相依性新增至 KMP 模組](multiplatform-spm-import.md)
* 探索其他 [Kotlin AI 技能](https://kotlinlang.org/docs/kotlin-ai-skills.html)。