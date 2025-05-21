---
title: 開發伺服器與持續編譯
---
與其每次想看到變更時，都手動編譯和執行 Kotlin/JS 專案，不如使用「持續編譯 (continuous compilation)」模式。 不要使用一般的 `run` 命令，而是以「持續 (continuous)」模式呼叫 Gradle wrapper：

```bash
./gradlew run --continuous
```

如果您在 IntelliJ IDEA 中工作，可以透過「執行配置 (run configuration)」傳遞相同的旗標。 從 IDE 第一次執行 Gradle `run` 任務後，IntelliJ IDEA 會自動為其產生一個執行配置，您可以對其進行編輯：

<img src="/img/edit-configurations.png" alt="在 IntelliJ IDEA 中編輯執行配置" width="700" style={{verticalAlign: 'middle'}}/>

透過「執行/偵錯配置 (Run/Debug Configurations)」對話方塊啟用持續模式，就像將 `--continuous` 旗標新增到執行配置的引數一樣簡單：

<img src="/img/run-debug-configurations.png" alt="將 continuous 旗標新增到 IntelliJ IDEA 中的執行配置" width="700" style={{verticalAlign: 'middle'}}/>

執行此執行配置時，您可以注意到 Gradle 程序會繼續監看程式的變更：

<img src="/img/waiting-for-changes.png" alt="Gradle 等待變更" width="700" style={{verticalAlign: 'middle'}}/>

偵測到變更後，程式將會自動重新編譯。 如果您仍然在瀏覽器中開啟頁面，開發伺服器 (development server) 將會觸發頁面的自動重新載入，並且變更將會顯示出來。 這要歸功於由 Kotlin Multiplatform Gradle 外掛程式管理的整合式 `webpack-dev-server`。