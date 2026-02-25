[//]: # (title: 為您的 Kotlin Multiplatform 專案選擇配置)

當您將 Kotlin Multiplatform 新增到現有專案或啟動新專案時，有多種結構化程式碼的方式。通常，您會建立一個或多個 Kotlin Multiplatform 共享模組，並在 Android 和 iOS 應用程式中使用它們。

若要為您的具體情況選擇最佳方法，請考慮以下問題：

* [您如何從 iOS 應用程式取用由 Kotlin Multiplatform 模組產生的 iOS 架構？](#connect-a-kotlin-multiplatform-module-to-an-ios-app)
  您是直接整合、透過 CocoaPods，還是使用 Swift Package Manager (SPM)？
* [您有一個還是多個 Kotlin Multiplatform 共享模組？](#module-configurations)
  多個共享模組的傘型模組 (umbrella module) 應該是什麼？
* [您是將所有程式碼儲存在 Monorepo 中，還是在不同的儲存庫中？](#repository-configurations)
* [您是將 Kotlin Multiplatform 模組架構作為本機相依性還是遠端相依性來取用？](#code-sharing-workflow)

回答這些問題將幫助您為專案挑選最佳配置。

## 將 Kotlin Multiplatform 模組連接至 iOS 應用程式

要從 iOS 應用程式使用 Kotlin Multiplatform 共享模組，您首先需要從該共享模組產生
一個 [iOS 架構](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html)。
然後，您應該將其作為相依性新增到 iOS 專案中。

通常，有兩種具有不同實作方式的選項：

* 本機相依性：Kotlin 組建直接與 iOS 組建互動。
* 遠端相依性：Kotlin 組建產生一個 iOS 架構，然後您使用封裝管理員將其連接到 iOS 專案。

要查看 iOS 整合的所有可用選項，請參閱 [iOS 整合方法](multiplatform-ios-integration-overview.md)。

## 模組配置

您可以在 Kotlin Multiplatform 專案中使用兩種模組配置選項：單一模組或多個共享模組。

### 單一共享模組

最簡單的模組配置在專案中僅包含一個單一的共享 Kotlin Multiplatform 模組：

![單一共享模組](single-shared-module.svg){width=700}

Android 應用程式可以像依賴一般 Kotlin 模組一樣依賴 Kotlin Multiplatform 共享模組。然而，iOS 無法直接使用 Kotlin，因此 iOS 應用程式必須依賴由 Kotlin Multiplatform 模組產生的 iOS 架構。

<table>
  
<tr>
<th>優點</th>
     <th>缺點</th>
</tr>

  
<tr>
<td>
    <list>
       <li>僅使用單一模組的簡單設計可降低認知負荷。您不需要考慮將功能放在哪裡，或如何在邏輯上將其拆分為多個部分。</li>
       <li>作為起點非常合適。</li>
</list>
</td>
<td>
<list>
  <li>隨著共享模組的增長，編譯時間會增加。</li>
  <li>此設計不允許擁有獨立的功能，或僅對應用程式需要的功能建立相依性。</li>
</list>
</td>
</tr>

</table>

### 多個共享模組

隨著共享模組的增長，將其拆分為功能模組是一個好主意。這可以幫助您避免因僅有一個模組而導致的擴展性問題。

Android 應用程式可以直接依賴所有功能模組，或在必要時僅依賴其中的一部分。

iOS 應用程式可以依賴由 Kotlin Multiplatform 模組產生的單一架構。當您使用多個模組時，您需要新增一個依賴於所有正在使用的模組的額外模組，稱為「傘型模組 (umbrella module)」，然後您需要配置一個包含所有模組的架構，稱為「傘型架構 (umbrella framework)」。

> 傘型架構套件包含專案的所有共享模組，並會匯入到 iOS 應用程式中。
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
  <li>設定較為複雜，包括傘型架構的設定。</li>
 <li>模組間的相依性管理更為繁瑣。</li>
</list>
</td>
</tr>

</table>

要設定傘型模組，您需要新增一個獨立的模組，該模組依賴於所有功能模組，並從該模組產生一個架構：

![傘型架構](umbrella-framework.svg){width=700}

Android 應用程式可以為了保持一致性而依賴於傘型模組，也可以依賴於獨立的功能模組。傘型模組通常包含實用的工具函式和相依注入設定程式碼。

您可以僅將部分模組匯出到傘型架構，這通常發生在架構構件作為遠端相依性被取用時。其主要原因是透過確保排除自動產生的程式碼，來降低最終構件的大小。

傘型架構方法的一個已知限制是 iOS 應用程式無法僅使用部分功能模組 – 它會自動取用所有模組。有關此功能的可能改進，請在 [KT-42247](https://youtrack.jetbrains.com/issue/KT-42247) 和 [KT-42250](https://youtrack.jetbrains.com/issue/KT-42250) 中描述您的案例。

> 在下面的範例中，當您看到 iOS 應用程式依賴於傘型模組時，這意味著它也依賴於從該模組產生的傘型架構。
>
{style="tip"}

#### 為什麼需要傘型架構？ {initial-collapse-state="collapsed" collapsible="true"}

雖然可以在 iOS 應用程式中包含多個從不同 Kotlin Multiplatform 共享模組產生的架構，但我們不建議這樣做。當 Kotlin Multiplatform 模組被編譯為架構時，產生的架構會包含其所有的相依性。每當兩個或多個模組使用相同的相依性，並作為獨立的架構暴露給 iOS 時，Kotlin/Native 編譯器就會重複這些相依性。

這種重複會導致許多問題。首先，iOS 應用程式的大小會不必要地膨脹。其次，一個相依性的程式碼結構與重複相依性的程式碼結構不相容。這在嘗試於 iOS 應用程式內整合兩個具有相同相依性的模組時會產生問題。例如，不同模組透過相同相依性傳遞的任何狀態都不會連通。這可能導致非預期的行為和錯誤。請參閱 [TouchLab 文件](https://touchlab.co/multiple-kotlin-frameworks-in-application/)以獲取有關確切限制的更多詳細資訊。

Kotlin 不會產生通用的架構相依性，否則會產生重複，且您新增到應用程式的任何 Kotlin 二進位檔案都需要儘可能小。包含整個 Kotlin 執行階段以及來自所有相依性的所有程式碼是浪費的。Kotlin 編譯器能夠將二進位檔案修剪為特定組建確切需要的內容。然而，它不知道其他組建可能需要什麼，因此嘗試共享相依性是不可行的。我們正在探索各種選項以儘量減少此問題的影響。

此問題的解決方案是使用傘型架構。它可以防止 iOS 應用程式因重複相依性而膨脹，有助於最佳化產生的構件，並消除由相依性之間不相容所引起的困擾。

## 儲存庫配置

您可以在新的和現有的 Kotlin Multiplatform 專案中使用多種儲存庫配置選項，可以使用單一儲存庫或多個儲存庫的組合。

### Monorepo：所有內容都在一個儲存庫中

一種常見的儲存庫配置稱為 Monorepo 配置。這種方法用於 Kotlin Multiplatform 範例和教學。在這種情況下，儲存庫包含 Android 和 iOS 應用程式，以及共享模組或多個模組（包括傘型模組）：

![Monorepo 配置](monorepo-configuration-1.svg){width=700}

![Monorepo 配置](monorepo-configuration-2.svg){width=700}

通常，iOS 應用程式透過使用直接整合或 CocoaPods 整合，將 Kotlin Multiplatform 共享模組作為常規架構取用。請參閱[將 Kotlin Multiplatform 模組連接至 iOS 應用程式](#connect-a-kotlin-multiplatform-module-to-an-ios-app)以獲取更多詳細資訊和教學連結。

如果儲存庫處於版本控制之下，則應用程式和共享模組具有相同的版本。

<table>
  
<tr>
<th>優點</th>
     <th>缺點</th>
</tr>

  
<tr>
<td>
    <list>
       <li>藉助精靈易於設定。</li>
       <li>由於所有程式碼都位於同一個儲存庫中，iOS 開發人員可以輕鬆處理 Kotlin Multiplatform 程式碼。</li>
</list>
</td>
<td>
<list>
  <li>iOS 開發人員需要安裝和配置不熟悉的工具。</li>
<li>對於已儲存在不同儲存庫中的現有應用程式，此方法通常無效。</li>
</list>
</td>
</tr>

</table>

當現有的 Android 和 iOS 應用程式已儲存在不同儲存庫時，您可以將 Kotlin Multiplatform 部分新增到 Android 儲存庫或獨立的儲存庫中，而不是將它們合併。

### 兩個儲存庫：Android + 共享 | iOS

另一種專案配置是擁有兩個儲存庫。在這種情況下，Kotlin Multiplatform 儲存庫包含 Android 應用程式和共享模組（包括傘型模組），而 Xcode 專案包含 iOS 應用程式：

![兩個儲存庫配置](two-repositories.svg){width=700}

Android 和 iOS 應用程式可以分別進行版本管理，而共享模組則隨 Android 應用程式一起進行版本管理。

### 三個儲存庫：Android | iOS | 共享

另一個選項是為 Kotlin Multiplatform 模組建立一個獨立的儲存庫。在這種情況下，Android 和 iOS 應用程式儲存在獨立的儲存庫中，而專案的共享程式碼可以包含多個功能模組和用於 iOS 的傘型模組：

![三個儲存庫配置](three-repositories.svg){width=700}

每個專案都可以分別進行版本管理。Kotlin Multiplatform 模組也必須針對 Android 或 JVM 平台進行版本管理並發佈。您可以獨立發佈功能模組，也可以僅發佈傘型模組並讓 Android 應用程式依賴於它。

與 Kotlin Multiplatform 模組作為 Android 專案一部分的專案情境相比，單獨發佈 Android 構件可能會給 Android 開發人員帶來額外的複雜性。

當 Android 和 iOS 團隊都取用相同版本的構件時，他們以版本一致性運行。從團隊的角度來看，這避免了共享的 Kotlin Multiplatform 程式碼被 Android 開發人員「擁有」的印象。對於已經為功能開發發佈受版本管理的內部 Kotlin 和 Swift 套件的大型專案來說，發佈共享的 Kotlin 構件將成為現有工作流程的一部分。

### 多個儲存庫：Android | iOS | 多個程式庫

當功能需要在多個平台上的多個應用程式之間共享時，您可能更傾向於擁有許多包含 Kotlin Multiplatform 程式碼的儲存庫。例如，您可以將整個產品通用的記錄程式庫儲存在具有自己版本管理的獨立儲存庫中。

在這種情況下，您有多個 Kotlin Multiplatform 程式庫儲存庫。如果多個 iOS 應用程式使用「程式庫專案」的不同子集，則每個應用程式可以有一個額外的儲存庫，其中包含對程式庫專案具有必要相依性的傘型模組：

![多個儲存庫配置](many-repositories.svg){width=700}

在這裡，每個程式庫也必須針對 Android 或 JVM 平台進行版本管理和發佈。應用程式和每個程式庫都可以分別進行版本管理。

## 程式碼共享工作流程

iOS 應用程式可以將從 Kotlin Multiplatform 共享模組產生的架構作為「本機」或「遠端」相依性來取用。您可以透過在 iOS 組建中提供架構的本機路徑來使用本機相依性。在這種情況下，您不需要發佈架構。或者，您可以將帶有架構的構件發佈到某處，並讓 iOS 應用程式像取用任何其他第三方相依性一樣將其作為遠端相依性取用。

### 本機：原始碼發佈

本機發佈是指 iOS 應用程式取用 Kotlin Multiplatform 模組架構而無需發佈。iOS 應用程式可以直接整合架構或透過使用 CocoaPods 整合。

當 Android 和 iOS 團隊成員都希望編輯共享的 Kotlin Multiplatform 程式碼時，通常使用此工作流程。iOS 開發人員需要安裝 IntelliJ IDEA 或 Android Studio，並具備 Kotlin 和 Gradle 的基礎知識。

在本機發佈方案中，iOS 應用程式組建會觸發 iOS 架構的產生。這意味著 iOS 開發人員可以立即觀察到他們對 Kotlin Multiplatform 程式碼所做的更改：

![本機原始碼發佈](local-source-distribution.svg){width=700}

此場景通常用於兩種情況。首先，它可以用於 Monorepo 專案配置中作為預設工作流程，無需發佈構件。其次，它除了遠端工作流程外，還可以用於本機開發。有關更多詳細資訊，請參閱[為本機開發設定本機相依性](#setting-up-a-local-dependency-for-local-development)。

當所有團隊成員都準備好編輯整個專案中的程式碼時，此工作流程最有效。它包括在對通用部分進行更改後的 Android 和 iOS 部分。理想情況下，每位團隊成員都可以安裝 IntelliJ IDEA/Android Studio 和 Xcode，以便在更改通用程式碼後開啟並執行 Android 和 iOS 應用程式。

<table>
  
<tr>
<th>優點</th>
     <th>缺點</th>
</tr>

  
<tr>
<td>
    <list>
       <li>Android 和 iOS 團隊成員都可以輕鬆編輯 Kotlin Multiplatform 程式碼，確保建立和維護共享程式碼是共同的責任。這有助於防止團隊孤立並鼓勵協作。</li>
       <li>此方法不需要對共享程式碼進行單獨的版本管理和發佈。</li>
       <li>開發工作流程更快，因為 iOS 團隊成員不必等待構件的建立和發佈。</li>
   </list>
</td>
<td>
  <list>
    <li>團隊成員需要在他們的電腦上設定完整的開發環境。</li>
    <li>iOS 開發人員必須學習如何使用 IntelliJ IDEA 或 Android Studio 和 Gradle。</li>
    <li>隨著共享程式碼增多和團隊擴大，管理變更變得困難。</li>
  </list>
</td>
</tr>

</table>

### 遠端：構件發佈

遠端發佈意味著架構構件是使用 Swift Package Manager 或作為 CocoaPod 發佈的，並由 iOS 應用程式取用。Android 應用程式可以本機或遠端取用二進位相依性。

遠端發佈通常用於逐步將技術引入現有專案。它不會顯著改變 iOS 開發人員的工作流程和建置過程。擁有兩個或多個儲存庫的團隊主要使用遠端發佈來儲存專案程式碼。

作為開始，您可能想使用 [KMMBridge](https://touchlab.co/trykmmbridge) – 一套能大大簡化遠端發佈工作流程的建置工具。或者，您也可以隨時自行設定類似的工作流程：

![遠端構件發佈](remote-artifact-distribution.svg){width=700}

<table>
  
<tr>
<th>優點</th>
     <th>缺點</th>
</tr>

  
<tr>
<td>不參與的 iOS 團隊成員不必使用 Kotlin 編寫程式碼，也不必學習如何使用 IntelliJ IDEA/Android Studio 或 Gradle 等工具。
      這顯著降低了團隊的進入門檻。</td>
<td>
  <list>
    <li>iOS 開發人員的工作流程較慢，因為編輯和建置共享程式碼的過程涉及發佈和版本管理。</li>
   <li>在 iOS 上偵錯共享的 Kotlin 程式碼很困難。</li>
   <li>iOS 團隊成員對共享程式碼做出貢獻的可能性顯著降低。</li>
   <li>共享程式碼的維護完全落在參與的團隊成員身上。</li>
  </list>
</td>
</tr>

</table>

#### 為本機開發設定本機相依性

許多團隊在採用 Kotlin Multiplatform 技術時選擇遠端發佈工作流程，以保持 iOS 開發人員的開發流程不變。然而，在此工作流程中，他們很難更改 Kotlin Multiplatform 程式碼。我們建議透過對 Kotlin Multiplatform 模組產生的架構建立本機相依性，來設定額外的「本機開發」工作流程。

當開發人員新增功能時，他們切換到將 Kotlin Multiplatform 模組作為本機相依性取用。這允許更改通用的 Kotlin 程式碼，立即從 iOS 觀察行為，並偵錯 Kotlin 程式碼。當功能就緒後，他們可以切換回遠端相依性並相應地發佈他們的更改。首先，他們將更改發佈到共享模組，然後才對應用程式進行更改。

對於遠端發佈工作流程，請使用 Swift Package Manager。對於本機發佈工作流程，請直接整合架構。

<!-- This tutorial [TODO] describes how to switch workflows by choosing the corresponding scheme in Xcode:
[TODO screenshot] -->

如果您使用 CocoaPods，您也可以將 CocoaPods 用於本機發佈工作流程。您按照 [TouchLab 文件](https://touchlab.co/kmmbridgecocoapodslocal)中的說明，透過更改環境變數在它們之間切換。