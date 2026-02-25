[//]: # (title: 開發伺服器與連續編譯)

與其每次在想要查看變更時手動編譯並執行 Kotlin/JS 專案，你可以使用「*連續編譯*」模式。不要使用常規的 `jsBrowserDevelopmentRun`（適用於 `browser`）和 `jsNodeDevelopmentRun`（適用於 `nodejs`）指令，請以連續模式調用 Gradle wrapper：

```bash
 # For `browser` project
./gradlew jsBrowserDevelopmentRun --continuous

 # For `nodejs` project
./gradlew jsNodeDevelopmentRun --continuous
```

如果你正在 IntelliJ IDEA 中工作，可以透過執行配置列表傳遞相同的旗標。在 IDE 中首次執行 `jsBrowserDevelopmentRun` Gradle 任務後，IntelliJ IDEA 會自動為其產生一個執行配置，你可以在頂部工具列進行編輯：

![在 IntelliJ IDEA 中編輯執行配置](edit-configurations.png){width=700}

透過 **執行/偵錯配置** 對話方塊啟用連續模式，方法是在執行配置的引數中加入 `--continuous` 旗標：

![在 IntelliJ IDEA 的執行配置中加入 continuous 旗標](run-debug-configurations.png){width=700}

執行此執行配置時，你可以注意到 Gradle 程序會持續監控程式的變更：

![Gradle 正在等待變更](waiting-for-changes.png){width=700}

一旦偵測到變更，程式將自動重新編譯。如果你仍在大瀏覽器中開啟網頁，開發伺服器會觸發頁面自動重新載入，變更便會生效。這歸功於由 [Kotlin Multiplatform Gradle 外掛程式](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html) 管理的整合式 [`webpack-dev-server`](https://webpack.js.org/configuration/dev-server/)。