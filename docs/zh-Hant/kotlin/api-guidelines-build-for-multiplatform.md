[//]: # (title: 建立適用於多平台的 Kotlin 函式庫)

建立 Kotlin 函式庫時，請考慮建立並[發佈支援 Kotlin Multiplatform 的函式庫](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html)。這將擴展您的函式庫的目標受眾，使其與鎖定多個平台的專案相容。

以下各節提供指南，協助您有效建立 Kotlin Multiplatform 函式庫。

## 最大化您的觸及範圍

為了使您的函式庫能作為依賴項提供給最多的專案，請盡可能支援最多的 Kotlin Multiplatform [目標平台](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)。

如果您的函式庫不支援多平台專案所使用的平台（無論是函式庫還是應用程式），該專案將難以依賴您的函式庫。在這種情況下，專案可以將您的函式庫用於某些平台，但需要為其他平台實作單獨的解決方案，或者他們將完全選擇支援其所有平台的替代函式庫。

為了簡化產物生成，您可以嘗試實驗性的[交叉編譯](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html#host-requirements)，從任何主機發佈 Kotlin Multiplatform 函式庫。這允許您在沒有 Apple 機器的情況下，為 Apple 目標生成 `.klib` 產物。我們計畫在未來穩定此功能並進一步改進函式庫發佈。請在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71290) 中留下您對此功能的意見回饋。

> 對於 Kotlin/Native 目標，請考慮使用[分層方法](native-target-support.md#for-library-authors)來支援所有可能的目標。
>
{style="note"}

## 設計可從共同程式碼使用的 API

建立函式庫時，請設計可從共同 Kotlin 程式碼使用的 API，而不是撰寫平台特定實作。

盡可能提供合理的預設組態，並包含平台特定組態選項。良好的預設值允許使用者從共同 Kotlin 程式碼使用函式庫的 API，無需撰寫平台特定實作來設定函式庫。

使用以下優先順序將 API 放置在最廣泛的相關來源集中：

*   **`commonMain` 來源集：** `commonMain` 來源集中的 API 可用於函式庫支援的所有平台。目標是將您函式庫的大部分 API 放在這裡。
*   **中間來源集：** 如果某些平台不支援特定的 API，請使用[中間來源集](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-discover-project.html#intermediate-source-sets)來鎖定特定平台。例如，您可以為支援多執行緒的目標建立 `concurrent` 來源集，或為所有非 JVM 目標建立 `nonJvm` 來源集。
*   **平台特定來源集：** 對於平台特定 API，請使用例如 `androidMain` 等來源集。

> 要了解有關 Kotlin Multiplatform 專案的來源集的更多資訊，請參閱[分層專案結構](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html)。
>
{style="tip"}

## 確保跨平台行為一致

為確保您的函式庫在所有支援的平台上行為一致，多平台函式庫中的 API 應在所有平台上接受相同範圍的有效輸入、執行相同的動作並返回相同的結果。同樣地，函式庫應統一處理無效輸入，並在所有平台上一致地報告錯誤或拋出異常。

不一致的行為會使函式庫難以使用，並迫使使用者在共同程式碼中添加條件邏輯以管理平台特定的差異。

您可以使用 [`expect` 和 `actual` 宣告](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)在共同程式碼中宣告具有平台特定實作的函式，這些實作可以完全存取每個平台的原生 API。這些實作也必須具有相同的行為，以確保它們可以從共同程式碼可靠地使用。

當 API 在跨平台行為一致時，它們只需在 `commonMain` 來源集中記錄一次即可。

> 如果平台差異不可避免，例如一個平台支援更廣泛的輸入集時，請盡可能地減少它們。例如，您可能不希望限制一個平台的功能以與其他平台匹配。在這種情況下，請清楚地記錄具體差異。
>
> {style="note"}

## 在所有平台進行測試

多平台函式庫可以擁有以共同程式碼撰寫並在所有平台執行的[多平台測試](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-run-tests.html)。在您支援的平台上定期執行此共同測試套件可以確保函式庫行為正確且一致。

在所有已發佈的平台上定期測試 Kotlin/Native 目標可能具有挑戰性。但是，為確保更廣泛的相容性，請考慮為其可支援的所有目標發佈函式庫，並在測試相容性時採用[分層方法](native-target-support.md#for-library-authors)。

使用 [`kotlin-test`](https://kotlinlang.org/api/latest/kotlin.test/) 函式庫在共同程式碼中撰寫測試，並使用平台特定的測試執行器執行它們。

## 考量非 Kotlin 使用者

Kotlin Multiplatform 在其支援的目標平台上提供與原生 API 和語言的互通性。建立 Kotlin Multiplatform 函式庫時，請考慮使用者是否需要從 Kotlin 以外的語言使用函式庫的類型和宣告。

例如，如果您的函式庫中的某些類型將透過互通性暴露給 Swift 程式碼，請設計這些類型以便於從 Swift 存取。 [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia) 提供了有關從 Swift 呼叫 Kotlin API 時其顯示方式的有用見解。

## 推廣您的函式庫

您的函式庫可以在 [JetBrains 搜尋平台](https://klibs.io/)上被推薦。它旨在讓使用者可以輕鬆地根據目標平台搜尋 Kotlin Multiplatform 函式庫。

符合條件的函式庫會自動新增。有關如何新增函式庫的更多資訊，請參閱[常見問題](https://klibs.io/faq)。