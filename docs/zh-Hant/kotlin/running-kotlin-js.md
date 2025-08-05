[//]: # (title: 執行 Kotlin/JS)

由於 Kotlin/JS 專案是透過 Kotlin Multiplatform Gradle 插件管理的，因此您可以使用適當的任務來執行您的專案。如果您是從空白專案開始，請確保您有一些可執行的範例程式碼。請建立 `src/jsMain/kotlin/App.kt` 檔案，並填入一段小型的「Hello, World」類型程式碼片段：

```kotlin
fun main() {
    console.log("Hello, Kotlin/JS!")
}
```

根據目標平台的選擇，首次執行程式碼可能需要一些平台特定的額外設定。

## 執行 Node.js 目標

當 Kotlin/JS 以 Node.js 為目標時，您只需執行 `jsNodeDevelopmentRun` Gradle 任務即可。例如，您可以使用 Gradle 包裝器透過命令列來執行此操作：

```bash
./gradlew jsNodeDevelopmentRun
```

如果您使用 IntelliJ IDEA，您可以在 Gradle 工具視窗中找到 `jsNodeDevelopmentRun` 動作：

![Gradle Run task in IntelliJ IDEA](run-gradle-task.png){width=700}

首次啟動時，`kotlin.multiplatform` Gradle 插件將下載所有必需的依賴項，以使您能夠順利啟動。建置完成後，程式將被執行，您可以在終端機中看到日誌輸出：

![Executing the JS target in a Kotlin Multiplatform project in IntelliJ IDEA](cli-output.png){width=700}

## 執行瀏覽器目標

當以瀏覽器為目標時，您的專案需要有一個 HTML 頁面。當您開發應用程式時，此頁面將由開發伺服器提供服務，並應嵌入您編譯後的 Kotlin/JS 檔案。請建立並填寫 HTML 檔案 `/src/jsMain/resources/index.html`：

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

預設情況下，您的專案所產生的構件（透過 webpack 建立）需要引用的名稱就是您的專案名稱（在此範例中為 `js-tutorial`）。如果您將專案命名為 `followAlong`，請務必嵌入 `followAlong.js` 而不是 `js-tutorial.js`。

完成這些調整後，請啟動整合式開發伺服器。您可以透過 Gradle 包裝器從命令列執行此操作：

```bash
./gradlew jsBrowserDevelopmentRun
```

從 IntelliJ IDEA 操作時，您可以在 Gradle 工具視窗中找到 `jsBrowserDevelopmentRun` 動作。

專案建置完成後，內嵌的 `webpack-dev-server` 將開始運行，並會開啟一個（看似空白的）瀏覽器視窗，指向您先前指定的 HTML 檔案。為驗證您的程式是否正確運行，請開啟瀏覽器的開發者工具（例如，透過右鍵點擊並選擇「_檢查_」動作）。在開發者工具內部，導覽至主控台，您可以在其中看到執行 JavaScript 程式碼的結果：

![Console output in browser developer tools](browser-console-output.png){width=700}

透過此設定，您可以在每次程式碼變更後重新編譯專案以查看您的變更。Kotlin/JS 也支援一種更方便的方式，可以在您開發應用程式時自動重新建置。要了解如何設定此 _持續模式_，請查閱 [相關教學課程](dev-server-continuous-compilation.md)。