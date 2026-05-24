[//]: # (title: 使用 Spring Boot 與 Claude 建立任務管理員應用程式)

<web-summary>了解如何使用 Claude 與 Spring Boot 建立 Kotlin 應用程式。</web-summary>

在本教學中，您將學習如何使用 [Claude](https://claude.com/product/overview) 建立一個管理任務的 Kotlin 應用程式。本教學使用 Spring Boot 來管理後端基礎結構，而 Claude 則負責規劃並開發應用程式。

如果您偏好在沒有 AI 協助的情況下建立應用程式，可以參考我們的[使用 Kotlin 與 Spring Boot 建立 Web 應用程式](jvm-get-started-spring-boot.md)教學。

> 與任何 AI 驅動工具一樣，Claude 可能會犯錯。請仔細審查 Claude 的變更，並僅在您信任的程式碼中使用它。
> 如需更多關於 Claude 安全政策的資訊，請參閱 [Claude Code 文件](https://code.claude.com/docs/en/security)。
> 
{style="note"}

## 設定環境

> 本教學透過 JetBrains AI Assistant 使用 Claude，但您也可以在終端中使用 Claude Code 來完成教學步驟。
>
{style="tip"}

1. 下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)。
2. 安裝 [JetBrains AI Assistant](https://plugins.jetbrains.com/plugin/22282-jetbrains-ai-assistant)。
3. 透過以下方式之一啟用 Claude Agent：
   * [使用 JetBrains AI 訂閱](https://www.jetbrains.com/help/ai-assistant/activate-agents.html#activate-claude-agent-with-jbai-subscription)
   * [使用 API 金鑰](https://www.jetbrains.com/help/ai-assistant/activate-agents.html#activate-claude-agent-with-api-key)
   * [使用 Anthropic 控制台](https://www.jetbrains.com/help/ai-assistant/activate-agents.html#activate-agent-with-provider-specific-method)

## 建立專案

> 您也可以使用 [Spring 的網頁版專案產生器](https://start.spring.io/#!language=kotlin&type=gradle-project-kotlin)來建立 Spring Boot 專案。
>
{style="tip"}

在 IntelliJ IDEA 中建立一個新的 Spring Boot 專案：

1. 在 IntelliJ IDEA 中，選取 **File** | **New** | **Project**。
2. 在左側面板中，選取 **New Project** | **Spring Boot**。
3. 在 **New Project** 視窗中指定以下欄位與選項：

   * **Name**: task-manager-demo
   * **Language**: Kotlin
   * **Type**: Gradle - Kotlin

     > 此選項指定了建置系統與 DSL。
     >
     {style="tip"}

   * **Package name**: org.jetbrains.kotlin.taskmanagerdemo
   * **JDK**: jbr-21
   * **Java**: 17

     > 如果您尚未安裝這些 Java 與 JDK 版本，可以從下拉式清單中下載。
     >
     {style="tip"}

   ![建立 Spring Boot 專案](create-spring-claude-project.png){width=800}

4. 確認您已填寫所有欄位，然後點擊 **Next**。
5. 在 **Spring Boot** 欄位中選取最新的穩定 Spring Boot 版本。
6. 選取 **Web | Spring Web** 相依性。

   ![設定 Spring Boot 專案](spring-claude-dependency.png){width=800}

7. 點擊 **Create** 以產生並設定專案。

   IDE 會產生並開啟新專案。下載與匯入專案相依性可能需要一些時間。

## 建立開發計畫

在您的專案中：

1. 開啟 ![AI Chat](toolWindowChat@20x20.svg){width=20} **AI Chat** 工具視窗。預設情況下已選取 **Chat** 模式。選取 **Claude Agent**。

   ![選取 Claude Agent](select-claude-agent.png){width=300}

2. 點擊 **Mode: Default** ![操作模式](app-client.expui.general.chevronDownLarge.svg){width=20}{type="joined"} 並選取 **Mode: Plan Mode**。
   Claude Agent 現在已準備好進行計畫而不會執行任何操作。

   ![選取計畫模式](claude-plan-mode.png){width=400}

   > 如需更多關於不同操作模式的資訊，請參閱[選取操作模式](https://www.jetbrains.com/help/ai-assistant/claude-agent.html#select-operation-mode)。
   >
   {style="tip"}

3. 撰寫一段提示詞，要求 Claude 建立一個任務管理員應用程式。分享一些您認為應該包含的細節。例如：

   ```text
   我想要建立一個用於管理任務的任務管理員應用程式，例如雜貨清單。
   它應該具有基本的 UI，並包含類別、到期日、優先級和狀態追蹤。

   在工作時使用 VCS。按步驟進行，並在每個階段建立提交，以便我稍後可以審查變更。
   ```

   > 關於如何設計提示詞的指引，請參閱 [Claude Code 最佳實務](https://code.claude.com/docs/en/best-practices)。
   >
   {style="tip"}

   Claude 會探索現有的專案結構並提出計畫。

4. 在繼續之前請仔細審查計畫。如果您想進行一些修改，請選取 **No, keep planning** 並分享您的後續評論。
5. 當您準備好繼續時，根據您希望對 Claude 的變更擁有多少控制權，選取 **Yes ...** 選項。

   ![準備好編碼](ready-to-code.png){width=600}

   > 如需更多關於不同選項的資訊，請參閱 [Claude Code 權限模式](https://code.claude.com/docs/en/best-practices)。
   >
   {style="tip"}

6. Claude 會退出 **Plan Mode** 並開始工作。等待工作完成。

## 審查提交

在執行應用程式之前，請仔細審查產生的變更：

1. 開啟 **Git** 工具視窗以查看提交清單。
2. 選取一個提交並按兩下每個修改過的檔案，在 IntelliJ IDEA 的並排檢視器中審查 diff。

![並排檢視器](side-by-side-viewer.png){width=800}

## 執行應用程式

一旦您對變更感到滿意，即可執行應用程式：

1. 執行 `bootRun` Gradle 任務，或在終端中輸入以下指令：

   ```bash
   ./gradlew bootRun
   ```

2. 在瀏覽器中開啟 localhost URL。預設通常為：

   ```text
   http://localhost:8080
   ```

   您現在應該可以看到 Claude 建立的基本 UI。

   ![執行應用程式](run-spring-claude-app.png){width=800}

   > 由於 UI 是由 Claude 設計的，您的 UI 可能與本教學中的版本有所不同。
   >
   {style="tip"}

## 測試應用程式

現在是您測試應用程式的時候了。

### 手動測試 UI

從測試 UI 功能開始。嘗試一些簡單的操作：

1. 建立一個任務並測試表單欄位。
2. 編輯一個任務以檢查變更是否持久。
3. 變更任務的狀態。
4. 刪除一個任務。
5. 變更任務的類別。

如果任何操作無法正常運作，請向 Claude 發送新的提示詞，要求其調查並修復問題。

### 執行單元測試

Claude 也會自動建立一些測試。透過執行以下指令檢查所有測試是否通過：

   ```bash
   ./gradlew test
   ```

或者，在 `src/test` 目錄中開啟一個測試，並點擊邊欄中的執行圖示 ![執行圖示](app-client.expui.run.run.svg){width=20}。成功的測試會顯示 ![執行成功圖示](app-client.expui.gutter.runSuccess.svg){width=20}。

如果任何測試失敗，請向 Claude 發送新的提示詞，要求其調查並修復問題。

## 進行改進

現在初始任務已完成，您可以進行改進。例如，讓我們改善 UI，使使用者可以直接在清單中編輯任務。

您可以發送如下提示詞：

```text
下一步，允許使用者內嵌編輯任務。例如，讓使用者點擊任務標題直接在清單中編輯，
並在不離開當前檢視的情況下更新優先級、到期日或狀態等欄位。
這項變更應該讓應用程式使用起來感覺更快、更直覺。
```

就像之前一樣，Claude 會探索現有的專案結構並提出計畫。
在您接受計畫後，等待 Claude 完成，審查變更，然後再次執行應用程式。

<img src="make-refinements-claude.gif" alt="使用 Claude 改進您的 Spring Boot 應用程式" width="600"/>

恭喜！您已成功使用 Claude 直接在 IntelliJ IDEA 中規劃、建置、測試並改進了一個 Kotlin Spring Boot 應用程式。

## 下一步？

* 了解 [](kotlin-ai-skills.md)
* 查看我們關於使用 [Junie 搭配 Kotlin AI 技能](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-spm-migration-ai.html)的教學