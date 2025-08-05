[//]: # (title: 為您的 Kotlin Multiplatform 專案選擇組態)

當您將 Kotlin Multiplatform 加入現有專案或啟動新專案時，有不同的方式來組織您的程式碼。通常，您會建立一個或多個 Kotlin Multiplatform 共享模組，並從您的 Android 和 iOS 應用程式中使用它們。

若要為您的特定情況選擇最佳方法，請考量以下問題：

* [您如何從 iOS 應用程式中取用 Kotlin Multiplatform 模組生成的 iOS framework？](#connect-a-kotlin-multiplatform-module-to-an-ios-app)
  您是直接整合、透過 CocoaPods 整合，還是使用 Swift package manager (SPM)？
* [您有一個還是多個 Kotlin Multiplatform 共享模組？](#module-configurations)
  哪些應該是多個共享模組的整合模組？
* [您是將所有程式碼儲存在 monorepo 中，還是儲存在不同的 repositories 中？](#repository-configurations)
* [您是將 Kotlin Multiplatform 模組 framework 作為本地或遠端依賴項來取用？](#code-sharing-workflow)

回答這些問題將有助於您為專案選擇最佳組態。

## 將 Kotlin Multiplatform 模組連接到 iOS 應用程式

若要從 iOS 應用程式中使用 Kotlin Multiplatform 共享模組，您首先需要從此共享模組生成一個 [iOS framework](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html)。然後，您應該將其作為依賴項新增到 iOS 專案中：

![Kotlin Multiplatform shared module](kmp-shared-module.svg){width=700}

可以將此 framework 作為本地或遠端依賴項來取用。

您可以透過以下其中一種方式，將 Kotlin Multiplatform 模組 framework 的依賴項新增到 iOS 專案中：

* **直接整合**。透過在 iOS 應用程式的建置中新增一個新的 run script phase，直接連接 framework。請參閱 [將 framework 連接到您的 iOS 專案](multiplatform-integrate-in-existing-app.md#configure-the-ios-project-to-use-a-kmp-framework) 以了解如何在 Xcode 中執行此操作。

  當您使用 Android Studio 精靈建立專案時，請選擇 **Regular framework** 選項以自動生成此設定。

* **CocoaPods 整合**。透過 [CocoaPods](https://cocoapods.org/) 連接 framework，CocoaPods 是一個用於 Swift 和 Objective-C 專案的流行依賴項管理器。它可以是本地或遠端依賴項。欲了解更多資訊，請參閱 [將 Kotlin Gradle 專案用作 CocoaPods 依賴項](multiplatform-cocoapods-xcode.md)。

  若要設定本地 CocoaPods 依賴項的工作流程，您可以透過精靈生成專案，或手動編輯 script。

* **使用 SPM**。您可以使用 Swift package manager (SPM) 連接 framework，SPM 是一個用於管理 Swift 程式碼分發的 Apple 工具。我們正在 [開發對 SPM 的官方支援](https://youtrack.jetbrains.com/issue/KT-53877)。目前，您可以使用 XCFrameworks 設定對 Swift package 的依賴項。欲了解更多資訊，請參閱 [Swift package 匯出設定](multiplatform-spm-export.md)。

## 模組組態

在 Kotlin Multiplatform 專案中，您可以使用兩種模組組態選項：單一模組或多個共享模組。

### 單一共享模組

最簡單的模組組態只包含專案中的單一共享 Kotlin Multiplatform 模組：

![Single shared module](single-shared-module.svg){width=700}

Android 應用程式可以將 Kotlin Multiplatform 共享模組作為常規 Kotlin 模組來依賴。然而，iOS 無法直接使用 Kotlin，因此 iOS 應用程式必須依賴由 Kotlin Multiplatform 模組生成的 iOS framework。

<table>
  <tr>
     <th>優點</th>
     <th>缺點</th>
  </tr>
  <tr>
  <td>
    <list>
       <li>單一模組的簡單設計可減少認知負荷。您無需考慮將功能放在何處或如何邏輯地將其拆分為多個部分。</li>
       <li>作為起點效果極佳。</li>
</list>
</td>
<td>
<list>
  <li>隨著共享模組的增長，編譯時間會增加。</li>
  <li>此設計不允許擁有獨立功能或僅依賴應用程式所需的功能。</li>
</list>
</td>
</tr>
</table>

### 多個共享模組

隨著您的共享模組增長，將其分解為功能模組是一個好主意。這有助於您避免僅有一個模組所帶來的擴展性問題。

Android 應用程式可以直接依賴所有功能模組，或在必要時僅依賴其中部分模組。

iOS 應用程式可以依賴由 Kotlin Multiplatform 模組生成的一個 framework。當您使用多個模組時，您需要新增一個額外的模組，它依賴您正在使用的所有模組，此模組稱為 _整合模組_ (umbrella module)，然後您需要設定一個包含所有模組的 framework，此 framework 稱為 _整合 framework_ (umbrella framework)。

> 整合 framework bundle 包含專案的所有共享模組，並匯入到 iOS 應用程式中。
>
{style="tip"}

<table>
  <tr>
     <th>優點</th>
     <th>缺點</th>
  </tr>
  <tr>
  <td>
    <list>
       <li>共享程式碼的關注點分離。</li>
       <li>更好的擴展性。</li>
       </list>
</td>
<td>
<list>
  <li>更複雜的設定，包括整合 framework 的設定。</li>
 <li>跨模組的依賴項管理更複雜。</li>
</list>
</td>
</tr>
</table>

若要設定整合模組，您需要新增一個獨立的模組，它依賴所有功能模組，並從此模組生成一個 framework：

![Umbrella framework](umbrella-framework.svg){width=700}

Android 應用程式可以為了保持一致性而依賴整合模組，或依賴獨立的功能模組。整合模組通常包含有用的工具函式和依賴注入設定程式碼。

您可以只將部分模組匯出到整合 framework 中，通常是在 framework artifact 作為遠端依賴項被取用時。這樣做的主要原因是在確保排除自動生成的程式碼後，以減小最終 artifact 的大小。

整合 framework 方法的一個已知限制是 iOS 應用程式不能只使用部分功能模組 – 它會自動取用所有模組。對於此功能的可能改進，請在 [KT-42247](https://youtrack.jetbrains.com/issue/KT-42247) 和 [KT-42250](https://youtrack.jetbrains.com/issue/KT-42250) 中描述您的情況。

> 當您在下面的範例中看到 iOS 應用程式依賴整合模組時，這表示它也依賴從此模組生成的整合 framework。
>
{style="tip"}

#### 您為什麼需要整合 framework？ {initial-collapse-state="collapsed" collapsible="true"}

雖然可以在您的 iOS 應用程式中包含從不同 Kotlin Multiplatform 共享模組生成的 framework，但我們不建議採用此方法。當 Kotlin Multiplatform 模組編譯成 framework 時，生成的 framework 會包含其所有依賴項。每當兩個或更多模組使用相同的依賴項並作為單獨的 framework 暴露給 iOS 時，Kotlin/Native 編譯器會重複這些依賴項。

這種重複會導致許多問題。首先，iOS 應用程式的大小會不必要地膨脹。其次，一個依賴項的程式碼結構與重複依賴項的程式碼結構不相容。當嘗試在 iOS 應用程式中整合兩個具有相同依賴項的模組時，這會造成問題。例如，不同模組透過相同依賴項傳遞的任何 state 將不會連接。這可能導致意外行為和錯誤。請參閱 [TouchLab 文件](https://touchlab.co/multiple-kotlin-frameworks-in-application/) 以獲取有關確切限制的更多詳細資訊。

Kotlin 不會生成通用的 framework 依賴項，因為否則會出現重複，並且您新增到應用程式中的任何 Kotlin binary 都需要盡可能小。包含整個 Kotlin runtime 和所有依賴項的所有程式碼是浪費的。Kotlin 編譯器能夠將 binary 修剪到特定建置所需的確切內容。然而，它不知道其他建置可能需要什麼，因此嘗試共享依賴項是不可行的。我們正在探索各種選項以最大程度地減少此問題的影響。

解決此問題的方法是使用整合 framework。它可防止 iOS 應用程式因重複依賴項而膨脹，有助於優化生成的 artifact，並消除依賴項之間不相容所導致的困擾。

## Repository 組態

在新的和現有的 Kotlin Multiplatform 專案中，您可以使用多種 repository 組態選項，可以只使用一個 repository，也可以使用多個 repository 的組合。

### Monorepo：所有內容都在一個 repository 中

一種常見的 repository 組態稱為 monorepo 組態。此方法用於 Kotlin Multiplatform 範例和教學。在這種情況下，repository 包含 Android 和 iOS 應用程式，以及共享模組或多個模組，包括整合模組：

![Monorepo configuration](monorepo-configuration-1.svg){width=700}

![Monorepo configuration](monorepo-configuration-2.svg){width=700}

通常，iOS 應用程式透過直接或 CocoaPods 整合將 Kotlin Multiplatform 共享模組作為常規 framework 來取用。請參閱 [將 Kotlin Multiplatform 模組連接到 iOS 應用程式](#connect-a-kotlin-multiplatform-module-to-an-ios-app) 以獲取更多詳細資訊和教學連結。

如果 repository 受到版本控制，則應用程式和共享模組具有相同的版本。

<table>
  <tr>
     <th>優點</th>
     <th>缺點</th>
  </tr>
  <tr>
  <td>
    <list>
       <li>藉助精靈易於設定。</li>
       <li>iOS 開發人員可以輕鬆地處理 Kotlin Multiplatform 程式碼，因為所有程式碼都位於相同的 repository 中。</li>
</list>
</td>
<td>
<list>
  <li>iOS 開發人員需要設定和組態不熟悉的工具。</li>
<li>對於已經儲存在不同 repository 中的現有應用程式，此方法通常不適用。</li>
</list>
</td>
</tr>
</table>

當現有的 Android 和 iOS 應用程式已經儲存在不同的 repository 中時，您可以將 Kotlin Multiplatform 部分新增到 Android repository 或單獨的 repository 中，而不是合併它們。

### 兩個 repositories：Android + 共享 | iOS

另一種專案組態是擁有兩個 repository。在這種情況下，Kotlin Multiplatform repository 包含 Android 應用程式和共享模組，包括整合模組，而 Xcode 專案包含 iOS 應用程式：

![Two repository configuration](two-repositories.svg){width=700}

Android 和 iOS 應用程式可以單獨版本化，而共享模組與 Android 應用程式一起版本化。

### 三個 repositories：Android | iOS | 共享

另一種選擇是為 Kotlin Multiplatform 模組設定一個獨立的 repository。在這種情況下，Android 和 iOS 應用程式儲存在單獨的 repository 中，專案的共享程式碼可以包含多個功能模組和用於 iOS 的整合模組：

![Three repository configuration](three-repositories.svg){width=700}

每個專案都可以單獨版本化。Kotlin Multiplatform 模組也必須為 Android 或 JVM 平台版本化和發布。您可以獨立發布功能模組，或僅發布整合模組並讓 Android 應用程式依賴它。

與 Kotlin Multiplatform 模組是 Android 專案一部分的專案情境相比，單獨發布 Android artifacts 可能會為 Android 開發人員帶來額外的複雜性。

當 Android 和 iOS 團隊都取用相同的版本化 artifacts 時，它們在版本上保持一致。從團隊的角度來看，這避免了共享 Kotlin Multiplatform 程式碼“歸 Android 開發人員所有”的印象。對於已經為功能開發發布版本化內部 Kotlin 和 Swift package 的大型專案，發布共享 Kotlin artifacts 成為現有工作流程的一部分。

### 多個 repositories：Android | iOS | 多個 library

當功能應該在多個平台上的多個應用程式之間共享時，您可能更喜歡使用多個包含 Kotlin Multiplatform 程式碼的 repository。例如，您可以將整個產品通用的 logging library 儲存在一個獨立的 repository 中，並帶有自己的版本控制。

在這種情況下，您有多個 Kotlin Multiplatform library repository。如果多個 iOS 應用程式使用“library 專案”的不同子集，則每個應用程式可以有一個額外的 repository，其中包含整合模組以及對 library 專案的必要依賴項：

![Many repository configuration](many-repositories.svg){width=700}

在這裡，每個 library 也必須為 Android 或 JVM 平台版本化和發布。應用程式和每個 library 可以單獨版本化。

## 程式碼共享工作流程

iOS 應用程式可以將從 Kotlin Multiplatform 共享模組生成的 framework 作為 _本地_ 或 _遠端_ 依賴項來取用。您可以透過在 iOS 建置中提供 framework 的本地路徑來使用本地依賴項。在這種情況下，您不需要發布 framework。或者，您可以將帶有 framework 的 artifact 發布到某個地方，並讓 iOS 應用程式將其作為遠端依賴項來取用，就像任何其他第三方依賴項一樣。

### 本地：源碼分發

本地分發是指 iOS 應用程式取用 Kotlin Multiplatform 模組 framework 而無需發布。iOS 應用程式可以直接整合 framework，或透過使用 CocoaPods。

當 Android 和 iOS 團隊成員都希望編輯共享的 Kotlin Multiplatform 程式碼時，通常會使用此工作流程。iOS 開發人員需要安裝 Android Studio 並具備 Kotlin 和 Gradle 的基本知識。

在本地分發方案中，iOS 應用程式建置會觸發 iOS framework 的生成。這表示 iOS 開發人員可以立即觀察他們對 Kotlin Multiplatform 程式碼所做的更改：

![Local source distribution](local-source-distribution.svg){width=700}

此情境通常用於兩種情況。首先，它可以在 monorepo 專案組態中作為預設工作流程使用，而無需發布 artifact。其次，它可以與遠端工作流程結合使用，用於本地開發。請參閱 [設定用於本地開發的本地依賴項](#setting-up-a-local-dependency-for-local-development) 以獲取更多詳細資訊。

當所有團隊成員都準備好編輯整個專案中的程式碼時，此工作流程最有效。它包括在更改通用部分後，同時更改 Android 和 iOS 部分。理想情況下，每個團隊成員都可以安裝 Android Studio 和 Xcode，以便在更改通用程式碼後打開並運行兩個應用程式。

<table>
  <tr>
     <th>優點</th>
     <th>缺點</th>
  </tr>
  <tr>
  <td>
    <list>
       <li>Android 和 iOS 團隊成員都可以輕鬆編輯 Kotlin Multiplatform 程式碼，確保共享程式碼的建立和維護是共同的責任。這有助於防止團隊孤立並鼓勵協作。</li>
       <li>此方法不需要對共享程式碼進行單獨的版本化和發布。</li>
       <li>開發工作流程更快，因為 iOS 團隊成員無需等待 artifact 的建立和發布。</li>
   </list>
</td>
<td>
  <list>
    <li>團隊成員需要在其機器上設定完整的開發環境。</li>
    <li>iOS 開發人員必須學習如何使用 Android Studio 和 Gradle。</li>
    <li>隨著共享程式碼的增加和團隊的擴大，管理變更變得困難。</li>
  </list>
</td>
</tr>
</table>

### 遠端：artifact 分發

遠端分發表示 framework artifact 作為 CocoaPod 或 Swift package 使用 SPM 發布並由 iOS 應用程式取用。Android 應用程式可以本地或遠端取用 binary 依賴項。

遠端分發通常用於逐步將技術引入現有專案。它不會顯著改變 iOS 開發人員的工作流程和建置流程。擁有兩個或更多 repository 的團隊主要使用遠端分發來儲存專案程式碼。

作為起點，您可能希望使用 [KMMBridge](https://touchlab.co/trykmmbridge) – 一組建置工具，極大地簡化了遠端分發工作流程。或者，您可以隨時自行設定類似的工作流程：

![Remote artifact distribution](remote-artifact-distribution.svg){width=700}

<table>
  <tr>
     <th>優點</th>
     <th>缺點</th>
  </tr>
  <tr>
  <td>非參與的 iOS 團隊成員無需編寫 Kotlin 程式碼或學習如何使用 Android Studio 和 Gradle 等工具。這顯著降低了團隊的入門門檻。</td>
<td>
  <list>
    <li>iOS 開發人員的工作流程較慢，因為編輯和建置共享程式碼的過程涉及發布和版本化。</li>
   <li>在 iOS 上對共享 Kotlin 程式碼進行除錯很困難。</li>
   <li>iOS 團隊成員對共享程式碼貢獻的可能性顯著降低。</li>
   <li>共享程式碼的維護完全由參與團隊成員負責。</li>
  </list>
</td>
</tr>
</table>

#### 設定用於本地開發的本地依賴項

許多團隊在採用 Kotlin Multiplatform 技術時選擇遠端分發工作流程，以保持 iOS 開發人員的開發流程不變。然而，在這種工作流程中，他們很難更改 Kotlin Multiplatform 程式碼。我們建議設定一個額外的“本地開發”工作流程，其中包含對從 Kotlin Multiplatform 模組生成的 framework 的本地依賴項。

當開發人員新增功能時，他們會切換到將 Kotlin Multiplatform 模組作為本地依賴項來取用。這允許更改通用的 Kotlin 程式碼，立即從 iOS 觀察行為，並對 Kotlin 程式碼進行除錯。當功能準備就緒時，他們可以切換回遠端依賴項並相應地發布其更改。首先，他們發布對共享模組的更改，然後才對應用程式進行更改。

對於遠端分發工作流程，請使用 CocoaPods 整合或 SPM。對於本地分發工作流程，請直接整合 framework。

<!-- 本教學 [TODO] 描述如何透過在 Xcode 中選擇相應的 scheme 來切換工作流程：[TODO 螢幕截圖] -->

如果您使用 CocoaPods，您也可以使用 CocoaPods 進行本地分發工作流程。您可以透過更改環境變數來在它們之間切換，如 [TouchLab 文件](https://touchlab.co/kmmbridgecocoapodslocal) 中所述。