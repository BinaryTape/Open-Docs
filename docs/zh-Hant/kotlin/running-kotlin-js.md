[//]: # (title: 執行 Kotlin/JS)

由於 Kotlin/JS 專案是由 Kotlin Multiplatform Gradle 外掛程式管理，您可以使用適當的任務來執行您的專案。如果您是從空白專案開始，請確保您有一些可執行的範例程式碼。建立檔案 `src/jsMain/kotlin/App.kt` 並填入一個小型的「Hello, World」類型程式碼片段：

```kotlin
fun main() {
    console.log("Hello, Kotlin/JS!")
}
```

根據目標平台，可能需要一些平台特定的額外設定才能首次執行您的程式碼。

## 執行 Node.js 目標

當使用 Kotlin/JS 以 Node.js 為目標時，您可以簡單地執行 `jsNodeDevelopmentRun` Gradle 任務。這可以透過例如命令列 (command line) 使用 Gradle 包裝器 (Gradle wrapper) 來完成：

```bash
./gradlew jsNodeDevelopmentRun
```

如果您使用 IntelliJ IDEA，您可以在 Gradle 工具視窗中找到 `jsNodeDevelopmentRun` 動作：

![IntelliJ IDEA 中的 Gradle 執行任務](run-gradle-task.png){width=700}

首次啟動時，`kotlin.multiplatform` Gradle 外掛程式將下載所有必要的依賴項 (dependencies) 以便您能順利開始。建置完成後，程式會執行，您可以在終端機 (terminal) 中看到日誌輸出：

![在 IntelliJ IDEA 中執行 Kotlin Multiplatform 專案裡的 JS 目標](cli-output.png){width=700}

## 執行瀏覽器目標

當以瀏覽器為目標時，您的專案需要有一個 HTML 頁面。當您開發應用程式時，此頁面將由開發伺服器 (development server) 提供服務，並應嵌入 (embed) 您編譯好的 Kotlin/JS 檔案。建立並填寫一個 HTML 檔案 `/src/jsMain/resources/index.html`：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JS Client</title>
</head>
<body>
<script src="js-tutorial.js"></script>
</body>
</html>
```

預設情況下，您專案所生成之構件 (artifact) 的名稱 (透過 webpack 建立) 需要被引用，其名稱即為您的專案名稱 (在本例中為 `js-tutorial`)。如果您將專案命名為 `followAlong`，請確保嵌入 `followAlong.js` 而不是 `js-tutorial.js`。

進行這些調整後，啟動整合式開發伺服器 (integrated development server)。您可以透過命令列 (command line) 使用 Gradle 包裝器 (Gradle wrapper) 來執行此操作：

```bash
./gradlew jsBrowserDevelopmentRun
```

當從 IntelliJ IDEA 工作時，您可以在 Gradle 工具視窗中找到 `jsBrowserDevelopmentRun` 動作。

專案建置完成後，內嵌的 `webpack-dev-server` 將會啟動執行，並會開啟一個 (看似空白的) 瀏覽器視窗，指向您之前指定的 HTML 檔案。為了驗證您的程式是否正確執行，開啟瀏覽器的開發者工具 (developer tools) (例如透過右鍵點擊並選擇「檢查 (Inspect)」動作)。在開發者工具中，導航至控制台 (console)，您可以在其中看到執行後的 JavaScript 程式碼結果：

![瀏覽器開發者工具中的控制台輸出](browser-console-output.png){width=700}

透過此設定，您可以在每次程式碼變更後重新編譯您的專案以查看您的變更。Kotlin/JS 也支援一種更便捷的方式，可在您開發應用程式時自動重建應用程式。要了解如何設定此「連續模式 (continuous mode)」，請查看 [相應的教程](dev-server-continuous-compilation.md)。