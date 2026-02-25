[//]: # (title: 自訂編譯器外掛程式)

> Kotlin 編譯器外掛程式 API 並不穩定，且在每個版本中都會引入破壞性變更。
> 
{style="warning"}

<include from="compiler-plugins-overview.md" element-id="compiler-plugin-description"/>

在建立您自己的自訂編譯器外掛程式之前，請先查看 [可用編譯器外掛程式列表](compiler-plugins-overview.md)，確認是否已有適合您使用案例的外掛程式。

您也可以確認是否可以使用 [Kotlin Symbol Processing (KSP) API](https://kotlinlang.org/docs/ksp-overview.html) 或外部 Linter（如 [Android lint](https://developer.android.com/studio/write/lint)）來達成您的目標。

如果您 *仍然* 找不到所需的內容，則可以建立自訂編譯器外掛程式。請注意，Kotlin 編譯器外掛程式 API 是 **不穩定** 的。由於每個新的編譯器版本都會引入破壞性變更，您需要投入大量的持續精力來維護它。

### Kotlin 編譯器與編譯器外掛程式

<p></p> <!-- workaround for MRK057: Paragraph can only contain inline elements-->
<list columns="2">
    <li>
        <p></p>
        <br/>
        <img src="compiler-stages.svg" width="400" alt="Kotlin 編譯器階段"/>
    </li>
    <li>
        <p>Kotlin 編譯器：</p>
        <ol>
            <li>剖析原始碼並將其轉換為結構化的語法樹。</li>
            <li>透過確定程式碼的含義、解析名稱、檢查型別並執行可見性規則來分析與解析程式碼。</li>
            <li>產生中間表示 (Intermediate Representation, IR)，這是一種作為原始碼與機器碼之間橋樑的資料結構。</li>
            <li>逐步將 IR lowering 為更簡單的形式。</li>
            <li>將降低後的 IR 轉換為特定目標的輸出，例如 JVM 位元組碼、JavaScript 或原生機器碼。</li>
        </ol>
    </li>
</list>

外掛程式可以透過 Frontend API 影響初始的編譯器階段，改變編譯器解析程式碼的方式。
例如，外掛程式可以加入註解、引入沒有主體的新方法，或更改可見性限定詞。這些變更在 IDE 中是可見的。

外掛程式也可以透過 Backend API 影響後續階段，修改宣告的行為。這些變更會出現在編譯完成後產生的二進位檔中。

在實作中，編譯器外掛程式會影響從分析、解析到程式碼產生的各個階段，涵蓋前端與後端。例如，前端部分產生宣告，而後端部分為這些宣告加入主體。

![帶有外掛程式的 Kotlin 編譯器階段](compiler-stages-with-plugins.svg){width=650}

[Kotlin serialization 外掛程式](https://github.com/Kotlin/kotlinx.serialization) 是一個很好的例子。該外掛程式的前端部分會加入一個隨伴物件 (companion object) 和一個序列化器函式，並進行檢查以防止名稱衝突。後端部分則透過 `KSerializer` 物件實作所需的序列化行為。

### Kotlin 編譯器外掛程式範本

要開始撰寫自訂編譯器外掛程式，您可以使用 [Kotlin 編譯器外掛程式範本](https://github.com/Kotlin/compiler-plugin-template)。
然後，您從前端和後端外掛程式 API 註冊擴充點。

> 目前，您只能使用 [Gradle](gradle.md) 開發自訂編譯器外掛程式。
> 
{style="note"}

### Frontend 外掛程式 API

Frontend 外掛程式 API（也稱為 Frontend 中間表示，FIR）具有以下專門的擴充點來自訂解析：

| 擴充功能名稱 | 描述 |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| [`FirAdditionalCheckersExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/checkers/src/org/jetbrains/kotlin/fir/analysis/extensions/FirAdditionalCheckersExtension.kt) | 加入自訂編譯器檢查器。 |
| [`FirDeclarationGenerationExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/providers/src/org/jetbrains/kotlin/fir/extensions/FirDeclarationGenerationExtension.kt)   | 產生新的宣告。 |
| [`FirExtensionSessionComponent`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirExtensionSessionComponent.kt)                  | 在 `FirSession` 中註冊自訂元件，供外掛程式的其他部分使用。 |
| [`FirFunctionTypeKindExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirFunctionTypeKindExtension.kt)                  | 定義新的函數型別系列。 |
| [`FirMetadataSerializerPlugin`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/fir-serialization/src/org/jetbrains/kotlin/fir/serialization/FirMetadataSerializerPlugin.kt)    | 讀取並寫入資訊至宣告的中繼資料。 |
| [`FirStatusTransformerExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/resolve/src/org/jetbrains/kotlin/fir/extensions/FirStatusTransformerExtension.kt)             | 修改宣告狀態屬性，例如可見性或模態 (modality)。 |
| [`FirSupertypeGenerationExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/resolve/src/org/jetbrains/kotlin/fir/extensions/FirSupertypeGenerationExtension.kt)         | 為現有類別加入新的父型別。 |
| [`FirTypeAttributeExtension`]( https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirTypeAttributeExtension.kt)                       | 根據型別註解為特定型別加入特殊屬性。 |

#### IDE 整合

解析的變更會影響 IDE 的行為（例如程式碼高亮和建議），因此您的外掛程式與 IDE 相容非常重要。每個版本的 IntelliJ IDEA 和 Android Studio 都包含一個開發版本的 Kotlin 編譯器。此版本專用於該 IDE，與已發佈的 Kotlin 編譯器不具備二進位相容性。因此，當您更新 IDE 時，也需要更新編譯器外掛程式以保持其正常運作。基於這個原因，社群外掛程式預設不會載入。

為了確保您的自訂編譯器外掛程式能在不同版本的 IDE 中運作，請針對每個 IDE 版本進行測試並修復發現的任何問題。

如果有了 Kotlin 編譯器外掛程式的開發工具包 (devkit)，支援多個 IDE 版本可能會變得更容易。如果您對此功能感興趣，請在我們的 [問題追蹤器](https://youtrack.jetbrains.com/issue/KT-82617) 中分享您的回饋。

### Backend 外掛程式 API

> 在不降低 IDE 或偵錯工具效能的情況下，正確開發 Backend 外掛程式是很困難的，因此請謹慎且保守地進行變更。
> 
{style="warning"}

Backend 外掛程式 API（也稱為 IR）具有單一擴充點：[`IrGenerationExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/ir/backend.common/src/org/jetbrains/kotlin/backend/common/extensions/IrGenerationExtension.kt)。
使用此擴充點並覆寫 `generate()` 函式，即可為前端已產生的宣告加入主體，或更改現有的宣告主體。

透過此擴充點所做的變更**不會**被編譯器檢查。您必須確保您的變更在此階段不會破壞編譯器的預期。例如，您可能會意外引入無效的型別、不正確的函式參考或正確作用域之外的參考。

#### 探索 Backend 外掛程式程式碼

您可以探索 Kotlin serialization 外掛程式的程式碼，了解實際的 Backend 編譯器外掛程式程式碼。
例如，[`SerializableCompanionIrGenerator.kt`](https://github.com/JetBrains/kotlin/blob/master/plugins/kotlinx-serialization/kotlinx-serialization.backend/src/org/jetbrains/kotlinx/serialization/compiler/backend/ir/SerializerIrGenerator.kt) 為關鍵的序列化器成員填補缺失的主體。其中一個例子是 [`generateChildSerializersGetter()`](https://github.com/JetBrains/kotlin/blob/9cfa558902abc13d245c825717026af63ef82dd2/plugins/kotlinx-serialization/kotlinx-serialization.backend/src/org/jetbrains/kotlinx/serialization/compiler/backend/ir/SerializerIrGenerator.kt#L242) 函式，它收集 `KSerializer` 運算式列表並將其在陣列中回傳。

#### 檢查您的 Backend 外掛程式程式碼是否存在問題

您可以透過三種方式檢查 Backend 外掛程式程式碼中的問題：

1. **驗證 IR**

    組建 IR 樹並啟用 `Xverify-ir` 編譯器選項。此選項對編譯速度有效能影響，因此請僅在測試期間使用。

2. **Dump 並比較 IR 輸出**

    在 IR lowering 編譯階段後使用 `-Xphases-to-dump-before=ExternalPackageParentPatcherLowering` 編譯器選項建立 dump 檔案。對於 JVM 後端，使用 `-Xdump-directory=<your-file-directory>` 編譯器選項配置 dump 目錄。手動撰寫預期程式碼，產生另一個 dump 檔案，並比較兩者以查看是否有差異。

3. **偵錯編譯器程式碼**

    在 `convertToIr.kt` 檔案中的 `convertToIrAndActualize()` 函式加入中斷點，並在偵錯模式下執行編譯器，以便在編譯期間獲取更詳細的資訊。

### 測試您的外掛程式

實作外掛程式後，請對其進行徹底測試。[Kotlin 編譯器外掛程式範本](https://github.com/Kotlin/compiler-plugin-template) 已設定為使用 [Kotlin 編譯器測試框架](https://github.com/JetBrains/kotlin/blob/master/compiler/test-infrastructure/ReadMe.md)。
您可以在以下目錄中加入測試：

* `compiler-plugin/testData`
* `compiler-plugin/testData/box` 用於程式碼產生測試
* `compiler-plugin/testData/diagnostics` 用於診斷測試

當測試執行時，框架會：

1. 剖析測試來源檔案。例如，[`anotherBoxTest.kt`](https://github.com/Kotlin/compiler-plugin-template/blob/master/compiler-plugin/testData/box/anotherBoxTest.kt)
2. 為每個檔案組建 FIR 和 IR。
3. 將這些內容寫入為文字 dump 檔案。例如，[`anotherBoxTest.fir.txt`](https://github.com/Kotlin/compiler-plugin-template/blob/master/compiler-plugin/testData/box/anotherBoxTest.fir.txt) 與 [`anotherBoxTest.fir.ir.txt`](https://github.com/Kotlin/compiler-plugin-template/blob/master/compiler-plugin/testData/box/anotherBoxTest.fir.ir.txt)。
4. 將這些檔案與先前建立的檔案（如果存在）進行比較。

您可以使用這些檔案來檢查產生的 diff 中是否有任何非預期的變更。如果沒有問題，新的 dump 檔案就會成為您最新的 _golden_ 檔案：這是經過核准且受信任的來源，可用於與未來的變更進行比較。

### 獲取協助

如果您在開發自訂編譯器外掛程式時遇到問題，請在 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 的 [#compiler](https://slack-chats.kotlinlang.org/c/compiler) 頻道尋求協助。我們不能保證一定有解決方案，但我們會盡力提供協助。