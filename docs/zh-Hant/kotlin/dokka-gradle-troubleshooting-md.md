[//]: # (title: Dokka Gradle 疑難排解)

本頁說明在 Gradle 組建中使用 Dokka 產生文件時可能遇到的常見問題。

如果您的問題未列於此，請在我們的 [問題追蹤器](https://kotl.in/dokka-issues) 中回報意見回饋或問題，或在官方 [Kotlin Slack](https://kotlinlang.slack.com/) 與 Dokka 社群交流。請點擊 [此處](https://kotl.in/slack) 獲取 Slack 邀請。

## 記憶體問題

在大型專案中，Dokka 可能會消耗大量記憶體來產生文件。這可能會超過 Gradle 的記憶體限制，尤其是在處理大量資料時。

當 Dokka 產生過程耗盡記憶體時，組建將會失敗，且 Gradle 可能會擲出如 `java.lang.OutOfMemoryError: Metaspace` 等例外狀況。

目前正致力於提升 Dokka 的效能，儘管部分限制源自於 Gradle。

如果您遇到記憶體問題，請嘗試以下解決方案：

* [增加堆積空間](#increase-heap-space)
* [在 Gradle 程序中執行 Dokka](#run-dokka-within-the-gradle-process)

### 增加堆積空間

解決記憶體問題的一種方法是增加 Dokka 產生程序的 Java 堆積記憶體量。在 `build.gradle.kts` 檔案中，調整以下配置選項：

```kotlin
    dokka {
        // Dokka 會產生一個由 Gradle 管理的新程序
        dokkaGeneratorIsolation = ProcessIsolation {
            // 配置堆積大小
            maxHeapSize = "4g"
        }
    }
```

在此範例中，最大堆積大小設定為 4 GB (`"4g"`)。請調整並測試該值，以找出適合您組建的最佳設定。

如果您發現 Dokka 需要大幅擴展堆積大小（例如顯著高於 Gradle 本身的記憶體使用量），請在 [Dokka 的 GitHub 存儲庫上建立問題](https://kotl.in/dokka-issues)。

> 您必須將此配置套用於每個子專案。建議您在套用於所有子專案的慣例外掛程式 (convention plugin) 中配置 Dokka。
>
{style="note"}

### 在 Gradle 程序中執行 Dokka

當 Gradle 組建和 Dokka 產生都需要大量記憶體時，它們可能會以個別程序的形式執行，進而在單一電腦上消耗大量記憶體。

為了最佳化記憶體使用，您可以在同一個 Gradle 程序中執行 Dokka，而不是作為獨立程序執行。這讓您可以統一配置 Gradle 的記憶體，而不需要為每個程序分別分配。

若要在同一個 Gradle 程序中執行 Dokka，請在 `build.gradle.kts` 檔案中調整以下配置選項：

```kotlin
    dokka {
        // 在目前的 Gradle 程序中執行 Dokka
        dokkaGeneratorIsolation = ClassLoaderIsolation()
    }
```

與 [增加堆積空間](#increase-heap-space) 相同，請測試此配置以確認其在您的專案中運行良好。

有關配置 Gradle JVM 記憶體的更多詳細資訊，請參閱 [Gradle 文件](https://docs.gradle.org/current/userguide/config_gradle.html#sec:configuring_jvm_memory)。

> 變更 Gradle 的 Java 選項會啟動新的 Gradle daemon，且該程序可能會持續存在很長時間。您可以 [手動停止任何其他 Gradle 程序](https://docs.gradle.org/current/userguide/gradle_daemon.html#sec:stopping_an_existing_daemon)。
>
> 此外，關於 `ClassLoaderIsolation()` 配置的 Gradle 問題可能會 [導致記憶體洩漏](https://github.com/gradle/gradle/issues/18313)。
>
{style="note"}