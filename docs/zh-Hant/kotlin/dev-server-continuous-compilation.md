[//]: # (title: 開發伺服器與連續編譯)

每次您想查看對 Kotlin/JS 專案所做的變更時，無需手動編譯和執行，您可以使用 _連續編譯_ 模式。無須使用正常的 `run` 命令，而是在 _連續_ 模式下呼叫 Gradle 包裝器：

```bash
./gradlew run --continuous
```

如果您在 IntelliJ IDEA 中工作，可以透過 _執行設定_ 傳遞相同的旗標。首次從 IDE 執行 Gradle `run` 任務後，IntelliJ IDEA 會自動為其生成一個執行設定，您可以編輯該設定：

![在 IntelliJ IDEA 中編輯執行設定](edit-configurations.png){width=700}

透過 **執行/偵錯設定** 對話方塊啟用連續模式，就像將 `--continuous` 旗標新增到執行設定的引數中一樣簡單：

![在 IntelliJ IDEA 中將連續旗標新增到執行設定](run-debug-configurations.png){width=700}

執行此執行設定時，您會注意到 Gradle 程序會持續監控程式的變更：

![Gradle 等待變更](waiting-for-changes.png){width=700}

一旦偵測到變更，程式將會自動重新編譯。如果您的瀏覽器中仍開啟著該頁面，開發伺服器將會觸發頁面自動重新載入，並且變更將會變得可見。這歸功於由 Kotlin Multiplatform Gradle 外掛程式管理的整合式 `webpack-dev-server`。