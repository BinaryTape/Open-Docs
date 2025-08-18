[//]: # (title: 開發伺服器和連續編譯)

為了避免每次想看到所做更改時都手動編譯並執行 Kotlin/JS 專案，您可以使用 _連續編譯_ 模式。您無需使用常規的 `run` 命令，而是以 _連續_ 模式呼叫 Gradle 包裝器：

```bash
./gradlew run --continuous
```

如果您正在 IntelliJ IDEA 中工作，您可以透過 _執行組態_ 傳遞相同的旗標。首次從 IDE 執行 Gradle 的 `run` 任務後，IntelliJ IDEA 會自動為其產生一個執行組態，您可以編輯該組態：

![在 IntelliJ IDEA 中編輯執行組態](edit-configurations.png){width=700}

透過 **執行/除錯組態** 對話框啟用連續模式，就像將 `--continuous` 旗標新增到執行組態的引數中一樣簡單：

![在 IntelliJ IDEA 中將連續旗標新增到執行組態](run-debug-configurations.png){width=700}

執行此執行組態時，您會注意到 Gradle 程序會持續監控程式碼的變更：

![Gradle 等待變更](waiting-for-changes.png){width=700}

一旦偵測到變更，程式碼將會自動重新編譯。如果瀏覽器中仍開啟著該頁面，開發伺服器將觸發頁面自動重新載入，並且這些變更將會可見。這要歸功於整合的 `webpack-dev-server`，該伺服器由 Kotlin 多平台 Gradle 外掛程式管理。