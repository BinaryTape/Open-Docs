[//]: # (title: 執行 Kotlin/JS)

由於 Kotlin/JS 專案是使用 Kotlin Multiplatform Gradle 外掛程式管理的，您可以使用相應的任務來執行您的專案。如果您是從空白專案開始，請確保您有一些範例程式碼可以執行。建立 `src/jsMain/kotlin/App.kt` 檔案並填入一段簡短的「Hello, World」類型程式碼片段：

```kotlin
fun main() {
    console.log("Hello, Kotlin/JS!")
}
```

根據目標平台的不同，第一次執行程式碼時可能需要一些平台特定的額外設定。

## 執行 Node.js 目標

當使用 Kotlin/JS 以 Node.js 為目標時，您只需執行 `jsNodeDevelopmentRun` Gradle 任務。例如，可以透過命令列使用 Gradle wrapper 來完成：

```bash
./gradlew jsNodeDevelopmentRun
```

如果您使用的是 IntelliJ IDEA，可以在 Gradle 工具視窗中找到 `jsNodeDevelopmentRun` 操作：

![IntelliJ IDEA 中的 Gradle 執行任務](run-gradle-task.png){width=700}

第一次啟動時，`kotlin.multiplatform` Gradle 外掛程式將下載所有必要的相依性以供執行。組建完成後，程式就會執行，您可以在終端中看到記錄輸出：

![在 IntelliJ IDEA 的 Kotlin Multiplatform 專案中執行 JS 目標](cli-output.png){width=700}

## 執行瀏覽器目標

以瀏覽器為目標時，您的專案必須有一個 HTML 頁面。在您開發應用程式時，此頁面將由開發伺服器提供，並且應該嵌入您編譯好的 Kotlin/JS 檔案。建立並填寫一個 HTML 檔案 `/src/jsMain/resources/index.html`：

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

預設情況下，需要引用的專案產生成品（透過 webpack 建立）名稱即為您的專案名稱（在此範例中為 `js-tutorial`）。如果您將專案命名為 `followAlong`，請確保嵌入的是 `followAlong.js` 而不是 `js-tutorial.js`。

完成這些調整後，啟動整合開發伺服器。您可以透過命令列經由 Gradle wrapper 執行：

```bash
./gradlew jsBrowserDevelopmentRun
```

在 IntelliJ IDEA 中工作時，您可以在 Gradle 工具視窗中找到 `jsBrowserDevelopmentRun` 操作。

專案組建完成後，內嵌的 `webpack-dev-server` 將開始執行，並會開啟一個（看似空白的）瀏覽器視窗，指向您先前指定的 HTML 檔案。要驗證程式是否正常執行，請開啟瀏覽器的開發者工具（例如，按一下右鍵並選擇「檢查」操作）。在開發者工具中，導覽至主控台，您可以在那裡看到執行的 JavaScript 程式碼結果：

![瀏覽器開發者工具中的主控台輸出](browser-console-output.png){width=700}

透過此設定，您可以在每次變更程式碼後重新編譯專案以查看變更。Kotlin/JS 還支援一種更便捷的方式，在您開發時自動重新組建應用程式。要瞭解如何設定此「持續模式」，請參閱[對應的教學](dev-server-continuous-compilation.md)。