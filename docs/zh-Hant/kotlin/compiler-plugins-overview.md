[//]: # (title: 編譯器外掛程式)

<snippet id="compiler-plugin-description">
編譯器外掛程式會掛勾（hook）編譯程序，在程式碼編譯時進行分析或修改，而無需修改編譯器本身。例如，它們可以為程式碼加上註解或產生新程式碼，使其與其他架構或 API 相容。
</snippet>

本頁面說明可供使用的 Kotlin 編譯器外掛程式，以及在沒有適合您使用案例的情況下可以採取的措施。

Kotlin 團隊維護以下編譯器外掛程式：

| 外掛程式                                                                                         | 描述                                                                                                                               |
|------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| [All-open](all-open-plugin.md)                                                                 | 自動將加上註解的類別及其成員設為 `open`，以便架構在執行期進行擴充。                                                                  |
| [AtomicFU](https://github.com/Kotlin/kotlinx-atomicfu)                                         | 將不可分割操作（atomic operations）轉換為高效且平台特定的實作，以實現無鎖（lock-free）的並行。                                 |
| [DataFrame](https://kotlin.github.io/dataframe/compiler-plugin.html)                           | 產生型別化 API，讓您能以安全且符合 Kotlin 習慣的方式處理 [`DataFrame`](https://kotlin.github.io/dataframe/home.html)。 |
| [`jvm-abi-gen`](https://github.com/JetBrains/kotlin/tree/master/plugins/jvm-abi-gen)           | 產生應用程式二進位介面 (ABI) JAR 檔案。                                                                                        |
| [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects) | 將 Kotlin 類別公開為純 JavaScript 物件，以提升與 JS 工具及程式庫的互通性。                                     |
| [kapt](kapt.md)                                                                                | 在 Kotlin 程式碼上執行 Java 註解處理器，並產生額外的原始碼檔案。                                                     |
| [Lombok](lombok.md)                                                                            | 讓 Kotlin 程式碼能理解並使用 Java 原始碼中由 Lombok 註解產生的程式碼。                                           |
| [`no-arg`](no-arg-plugin.md)                                                                   | 為加上註解的類別產生無參數建構函式，以支援需要此類函式的架構。                                         |
| [Power-assert](power-assert.md)                                                                | 透過顯示運算式各部分的詳細值來增強斷言失敗時的資訊。                                                         |
| [SAM with receiver](sam-with-receiver-plugin.md)                                               | 允許 SAM 介面使用具有接收者的 Lambda 運算式，以獲得更接近 DSL 的語法。                                                           |
| [Serialization](serialization.md)                                                              | 在不使用反射的情況下，產生用於序列化與反序列化 Kotlin 物件的程式碼。                                                        |

Google 的 Android 團隊維護：

| 外掛程式                                                                                      | 描述                                                                                                       |
|---------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| [Compose compiler Gradle plugin](https://developer.android.com/develop/ui/compose/compiler) | 將 Compose 編譯器與 Gradle 整合，以啟用宣告式 UI 功能和 Compose 特有的最佳化。 |
| [Parcelize plugin](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize) | 自動產生 `Parcelable` 實作，以便您在 Android 元件之間傳遞 Kotlin 物件。   |

如果您需要以這些外掛程式未涵蓋的方式調整編譯程序，請先確認是否可以使用 [Kotlin 符號處理 (KSP) API](https://kotlinlang.org/docs/ksp-overview.html) 或外部 Linter（例如 [Android lint](https://developer.android.com/studio/write/lint)）。您可以瀏覽我們的 [Kotlin Slack](https://slack-chats.kotlinlang.org/c/compiler) 或[聯絡我們](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)針對您的使用案例尋求建議。

如果您**仍然**找不到需要的內容，可以[建立自訂編譯器外掛程式](custom-compiler-plugins.md)。僅將此方法作為最後手段，因為 Kotlin 編譯器外掛程式 API 是**不穩定**的。如果您建立自訂編譯器外掛程式，則需要投入大量的持續心力來維護它，因為每個新的編譯器版本都可能引入破壞性變更。