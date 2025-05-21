---
title: "執行 Kotlin/JS"
---
由於 Kotlin/JS 專案是使用 Kotlin Multiplatform Gradle 插件（Kotlin Multiplatform Gradle plugin）進行管理的，因此您可以使用適當的任務（task）來執行您的專案。 如果您從一個空白專案開始，請確保您有一些範例程式碼可以執行。
建立檔案 `src/jsMain/kotlin/App.kt` 並填入一個小的 "Hello, World" 類型的程式碼片段：

```kotlin
fun main() {
    console.log("Hello, Kotlin/JS!")
}
```

根據目標平台（target platform）的不同，可能需要一些平台特定的額外設定，才能首次執行您的程式碼。

## 執行 Node.js 目標

當使用 Kotlin/JS 以 Node.js 作為目標時，您可以簡單地執行 `jsNodeDevelopmentRun` Gradle 任務。 例如，可以使用 Gradle wrapper 通過命令列來完成：

```bash
./gradlew jsNodeDevelopmentRun
```

如果您使用 IntelliJ IDEA，您可以在 Gradle 工具視窗中找到 `jsNodeDevelopmentRun` 操作：

<img src="/img/run-gradle-task.png" alt="Gradle Run task in IntelliJ IDEA" width="700" style={{verticalAlign: 'middle'}}/>

首次啟動時，`kotlin.multiplatform` Gradle 插件將下載所有必需的依賴項，以使您可以啟動並執行。
建構完成後，程式將被執行，您可以在終端機中看到日誌輸出：

<img src="/img/cli-output.png" alt="Executing the JS target in a Kotlin Multiplatform project in IntelliJ IDEA" width="700" style={{verticalAlign: 'middle'}}/>

## 執行瀏覽器目標

當以瀏覽器為目標時，您的專案需要有一個 HTML 頁面。 在您開發應用程式時，此頁面將由開發伺服器提供服務，並且應該嵌入您編譯的 Kotlin/JS 檔案。
建立並填寫一個 HTML 檔案 `/src/jsMain/resources/index.html`：

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

預設情況下，需要引用的專案產生的 artifact 名稱（通過 webpack 建立）就是您的專案名稱（在本例中為 `js-tutorial`）。 如果您將您的專案命名為 `followAlong`，請確保嵌入 `followAlong.js` 而不是 `js-tutorial.js`。

完成這些調整後，啟動整合的開發伺服器（development server）。 您可以通過 Gradle wrapper 從命令列執行此操作：

```bash
./gradlew jsBrowserDevelopmentRun
```

當從 IntelliJ IDEA 工作時，您可以在 Gradle 工具視窗中找到 `jsBrowserDevelopmentRun` 操作。

在專案建構完成後，嵌入的 `webpack-dev-server` 將開始運行，並將打開一個（看起來是空的）瀏覽器視窗，指向您先前指定的 HTML 檔案。 要驗證您的程式是否正確運行，請打開瀏覽器的開發者工具（例如，右鍵單擊並選擇 _Inspect_ 操作）。
在開發者工具中，導航到控制台，您可以在其中看到已執行的 JavaScript 程式碼的結果：

<img src="/img/browser-console-output.png" alt="Console output in browser developer tools" width="700" style={{verticalAlign: 'middle'}}/>

通過此設定，您可以在每次程式碼變更後重新編譯您的專案，以查看您的變更。 Kotlin/JS 還支援一種更方便的方式，可以在您開發應用程式時自動重新建構應用程式。
要了解如何設定此 _continuous mode_，請查看[相關教程](dev-server-continuous-compilation)。