[//]: # (title: 為你的 Kotlin Multiplatform 專案選擇配置)

當你將 Kotlin Multiplatform 加入現有專案或啟動新專案時，有多種方式可以組織你的程式碼。通常，你會建立一個或多個 Kotlin Multiplatform 共享模組，並在你的 Android 和 iOS 應用程式中使用它們。

要為你的特定情況選擇最佳方法，請考慮以下問題：

*   [你如何從 iOS 應用程式中消費由 Kotlin Multiplatform 模組生成的 iOS 框架？](#connect-a-kotlin-multiplatform-module-to-an-ios-app)
    你是直接整合它、透過 CocoaPods，還是使用 Swift 套件管理器 (SPM)？
*   [你有一個還是幾個 Kotlin Multiplatform 共享模組？](#module-configurations)
    什麼是幾個共享模組的傘狀模組？
*   [你是將所有程式碼儲存在單一儲存庫中還是不同的儲存庫中？](#repository-configurations)
*   [你是將 Kotlin Multiplatform 模組框架作為本機依賴還是遠端依賴來消費？](#code-sharing-workflow)

回答這些問題將幫助你為專案選擇最佳配置。

## 將 Kotlin Multiplatform 模組連接到 iOS 應用程式

要在 iOS 應用程式中使用 Kotlin Multiplatform 共享模組，你首先需要從這個共享模組中生成一個 [iOS 框架](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html)。然後，你應該將其作為依賴加入到 iOS 專案中。

通常有兩種選項，具有不同的實作：

*   **本機依賴**。Kotlin 建置直接與 iOS 建置互動。
*   **遠端依賴**。Kotlin 建置產生一個 iOS 框架，然後你使用套件管理器將其連接到 iOS 專案。

要檢視所有可用的 iOS 整合選項，請參閱 [iOS 整合方法](multiplatform-ios-integration-overview.md)。

## 模組配置

在 Kotlin Multiplatform 專案中，你可以使用兩種模組配置選項：單一模組或多個共享模組。

### 單一共享模組

最簡單的模組配置只包含專案中的單一共享 Kotlin Multiplatform 模組：

![Single shared module](single-shared-module.svg){width=700}

Android 應用程式可以將 Kotlin Multiplatform 共享模組作為常規 Kotlin 模組來依賴。但是，iOS 無法直接使用 Kotlin，因此 iOS 應用程式必須依賴由 Kotlin Multiplatform 模組生成的 iOS 框架。

<table>
  
<tr>
<th>優點</th>
     <th>缺點</th>
</tr>

  
<tr>
<td>
    <list>
       <li>簡單的單一模組設計降低了認知負荷。你無需考慮將功能放在何處或如何將其邏輯地拆分為多個部分。</li>
       <li>非常適合作為起點。</li>
</list>
</td>
<td>
<list>
  <li>隨著共享模組的增長，編譯時間會增加。</li>
  <li>此設計不允許擁有單獨的功能，或僅依賴於應用程式所需的功能。</li>
</list>
</td>
</tr>

</table>

### 多個共享模組

隨著你的共享模組的增長，將其拆分為功能模組是個好主意。這有助於你避免僅有一個模組所導致的可擴展性問題。

Android 應用程式可以直接依賴所有功能模組，或在必要時僅依賴其中一部分。

iOS 應用程式可以依賴由 Kotlin Multiplatform 模組生成的一個框架。當你使用多個模組時，你需要新增一個額外的模組，該模組依賴於你正在使用的所有模組，這被稱為 _傘狀模組_，然後你需要配置一個包含所有模組的框架，這被稱為 _傘狀框架_。

> 傘狀框架套件包含專案的所有共享模組並匯入到 iOS 應用程式中。
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
  <li>更複雜的設定，包括傘狀框架設定。</li>
 <li>模組之間的依賴管理更為複雜。</li>
</list>
</td>
</tr>

</table>

要設定傘狀模組，你需要新增一個單獨的模組，該模組依賴於所有功能模組，並從此模組生成一個框架：

![Umbrella framework](umbrella-framework.svg){width=700}

Android 應用程式可以為了保持一致性而依賴傘狀模組，或依賴單獨的功能模組。傘狀模組通常包含有用的公用函數和依賴注入設定程式碼。

你只能將部分模組匯出到傘狀框架中，這通常發生在框架產物作為遠端依賴被消費時。這樣做的主要原因是透過排除自動生成的程式碼來縮小最終產物的大小。

傘狀框架方法的一個已知限制是 iOS 應用程式不能只使用部分功能模組——它會自動消費所有模組。對於此功能的可能改進，請在 [KT-42247](https://youtrack.jetbrains.com/issue/KT-42247) 和 [KT-42250](https://youtrack.jetbrains.com/issue/KT-42250) 中描述你的情況。

> 當你在下面的範例中看到 iOS 應用程式依賴於傘狀模組時，這表示它也依賴於從該模組生成的傘狀框架。
>
{style="tip"}

#### 為什麼你需要一個傘狀框架？ {initial-collapse-state="collapsed" collapsible="true"}

雖然在你的 iOS 應用程式中包含從不同 Kotlin Multiplatform 共享模組生成的幾個框架是可能的，但我們不建議這種方法。當 Kotlin Multiplatform 模組被編譯成框架時，生成的框架會包含其所有依賴。每當兩個或更多模組使用相同的依賴並作為單獨的框架暴露給 iOS 時，Kotlin/Native 編譯器會複製這些依賴。

這種複製會導致許多問題。首先，iOS 應用程式的大小會不必要地膨脹。其次，一個依賴的程式碼結構與複製的依賴的程式碼結構不相容。這在嘗試將兩個具有相同依賴的模組整合到 iOS 應用程式中時會產生問題。例如，透過相同依賴由不同模組傳遞的任何狀態將不會連接。這可能導致意外行為和錯誤。有關確切限制的更多詳細資訊，請參閱 [TouchLab 文件](https://touchlab.co/multiple-kotlin-frameworks-in-application/)。

Kotlin 不會產生共同的框架依賴，否則會出現重複，並且你新增到應用程式中的任何 Kotlin 二進位檔都需要盡可能小。包含整個 Kotlin 執行環境以及所有依賴中的所有程式碼都是浪費的。Kotlin 編譯器能夠將二進位檔修剪到特定建置所需的確切內容。但是，它不知道其他建置可能需要什麼，因此嘗試共享依賴是不可行的。我們正在探索各種選項以最大限度地減少此問題的影響。

解決這個問題的方法是使用傘狀框架。它防止了 iOS 應用程式因重複依賴而膨脹，有助於優化生成的產物，並消除了依賴之間不相容所導致的困擾。

## 儲存庫配置

在新的和現有的 Kotlin Multiplatform 專案中，你可以使用多種儲存庫配置選項，使用一個儲存庫或多個儲存庫的組合。

### Monorepo: 一切都在一個儲存庫中

一種常見的儲存庫配置稱為 Monorepo 配置。這種方法在 Kotlin Multiplatform 範例和教學中都有使用。在這種情況下，儲存庫包含 Android 和 iOS 應用程式，以及共享模組或多個模組，包括傘狀模組：

![Monorepo configuration](monorepo-configuration-1.svg){width=700}

![Monorepo configuration](monorepo-configuration-2.svg){width=700}

通常，iOS 應用程式透過直接或 CocoaPods 整合將 Kotlin Multiplatform 共享模組作為常規框架來消費。有關更多詳細資訊和教學連結，請參閱[將 Kotlin Multiplatform 模組連接到 iOS 應用程式](#connect-a-kotlin-multiplatform-module-to-an-ios-app)。

如果儲存庫處於版本控制下，則應用程式和共享模組具有相同的版本。

<table>
  
<tr>
<th>優點</th>
     <th>缺點</th>
</tr>

  
<tr>
<td>
    <list>
       <li>在精靈的幫助下易於設定。</li>
       <li>iOS 開發人員可以輕鬆使用 Kotlin Multiplatform 程式碼，因為所有程式碼都位於同一個儲存庫中。</li>
</list>
</td>
<td>
<list>
  <li>iOS 開發人員需要設定和配置不熟悉的工具。</li>
<li>對於已經儲存在不同儲存庫中的現有應用程式，此方法通常不起作用。</li>
</list>
</td>
</tr>

</table>

當現有的 Android 和 iOS 應用程式已經儲存在不同的儲存庫中時，你可以將 Kotlin Multiplatform 部分新增到 Android 儲存庫或單獨的儲存庫中，而不是將它們合併。

### 兩個儲存庫：Android + 共享 | iOS

另一個專案配置是擁有兩個儲存庫。在這種情況下，Kotlin Multiplatform 儲存庫包含 Android 應用程式和共享模組，包括傘狀模組，而 Xcode 專案包含 iOS 應用程式：

![Two repository configuration](two-repositories.svg){width=700}

Android 和 iOS 應用程式可以單獨版本化，而共享模組則與 Android 應用程式一起版本化。

### 三個儲存庫：Android | iOS | 共享

另一種選擇是為 Kotlin Multiplatform 模組設定單獨的儲存庫。在這種情況下，Android 和 iOS 應用程式儲存在單獨的儲存庫中，而專案的共享程式碼可以包含多個功能模組和用於 iOS 的傘狀模組：

![Three repository configuration](three-repositories.svg){width=700}

每個專案都可以單獨版本化。Kotlin Multiplatform 模組也必須為 Android 或 JVM 平台進行版本化和發布。你可以獨立發布功能模組，或只發布傘狀模組並讓 Android 應用程式依賴它。

與 Kotlin Multiplatform 模組是 Android 專案一部分的專案場景相比，單獨發布 Android 產物可能會給 Android 開發人員帶來額外的複雜性。

當 Android 和 iOS 團隊都消費相同的版本化產物時，它們以版本一致性運行。從團隊角度來看，這避免了共享的 Kotlin Multiplatform 程式碼「屬於」Android 開發人員的印象。對於已經發布用於功能開發的版本化內部 Kotlin 和 Swift 套件的大型專案，發布共享的 Kotlin 產物成為現有工作流程的一部分。

### 多個儲存庫：Android | iOS | 多個函式庫

當功能應該在多個平台上的多個應用程式之間共享時，你可能更喜歡擁有許多帶有 Kotlin Multiplatform 程式碼的儲存庫。例如，你可以將整個產品通用的日誌函式庫儲存在一個具有自己版本控制的單獨儲存庫中。

在這種情況下，你有許多 Kotlin Multiplatform 函式庫儲存庫。如果多個 iOS 應用程式使用「函式庫專案」的不同子集，則每個應用程式可以有一個額外的儲存庫，其中包含傘狀模組以及對函式庫專案的必要依賴：

![Many repository configuration](many-repositories.svg){width=700}

在這裡，每個函式庫也必須為 Android 或 JVM 平台進行版本化和發布。應用程式和每個函式庫都可以單獨版本化。

## 程式碼共享工作流程

iOS 應用程式可以將從 Kotlin Multiplatform 共享模組生成的框架作為_本機_或_遠端_依賴來消費。你可以透過在 iOS 建置中提供框架的本機路徑來使用本機依賴。在這種情況下，你無需發布框架。或者，你可以在某處發布一個帶有框架的產物，並讓 iOS 應用程式將其作為遠端依賴來消費，就像任何其他第三方依賴一樣。

### 本機：原始碼分發

本機分發是指 iOS 應用程式在無需發布的情況下消費 Kotlin Multiplatform 模組框架。iOS 應用程式可以直接整合框架，或透過 CocoaPods 整合。

當 Android 和 iOS 團隊成員都希望編輯共享的 Kotlin Multiplatform 程式碼時，通常會使用此工作流程。iOS 開發人員需要安裝 IntelliJ IDEA 或 Android Studio 並具備 Kotlin 和 Gradle 的基本知識。

在本機分發方案中，iOS 應用程式建置會觸發 iOS 框架的生成。這意味著 iOS 開發人員可以立即觀察他們對 Kotlin Multiplatform 程式碼所做的更改：

![Local source distribution](local-source-distribution.svg){width=700}

此場景通常用於兩種情況。首先，它可以用作 Monorepo 專案配置中的預設工作流程，而無需發布產物。其次，除了遠端工作流程外，它還可以用於本機開發。有關更多詳細資訊，請參閱[為本機開發設定本機依賴](#setting-up-a-local-dependency-for-local-development)。

當所有團隊成員都準備好編輯整個專案中的程式碼時，此工作流程最有效。這包括在對通用部分進行更改後編輯 Android 和 iOS 部分。理想情況下，每個團隊成員都可以安裝 IntelliJ IDEA/Android Studio 和 Xcode，以便在對通用程式碼進行更改後打開並運行 Android 和 iOS 應用程式。

<table>
  
<tr>
<th>優點</th>
     <th>缺點</th>
</tr>

  
<tr>
<td>
    <list>
       <li>Android 和 iOS 團隊成員都可以輕鬆編輯 Kotlin Multiplatform 程式碼，確保創建和維護共享程式碼是共同的責任。這有助於防止團隊孤立並鼓勵協作。</li>
       <li>此方法不需要對共享程式碼進行單獨的版本控制和發布。</li>
       <li>開發工作流程更快，因為 iOS 團隊成員無需等待產物創建和發布。</li>
   </list>
</td>
<td>
  <list>
    <li>團隊成員需要在他們的機器上設定完整的開發環境。</li>
    <li>iOS 開發人員必須學習如何使用 IntelliJ IDEA 或 Android Studio 和 Gradle。</li>
    <li>隨著共享程式碼的增加和團隊的擴大，管理更改變得困難。</li>
  </list>
</td>
</tr>

</table>

### 遠端：產物分發

遠端分發意味著框架產物使用 Swift 套件管理器或作為 CocoaPod 發布，並由 iOS 應用程式消費。Android 應用程式可以本地或遠端消費二進位依賴。

遠端分發通常用於將技術逐步引入現有專案。它不會顯著改變 iOS 開發人員的工作流程和建置過程。擁有兩個或更多儲存庫的團隊主要使用遠端分發來儲存專案程式碼。

作為開始，你可能希望使用 [KMMBridge](https://touchlab.co/trykmmbridge)——一組極大地簡化遠端分發工作流程的建置工具。或者，你也可以隨時自行設定類似的工作流程：

![Remote artifact distribution](remote-artifact-distribution.svg){width=700}

<table>
  
<tr>
<th>優點</th>
     <th>缺點</th>
</tr>

  
<tr>
<td>不參與的 iOS 團隊成員不必用 Kotlin 編寫程式碼或學習如何使用 IntelliJ IDEA/Android Studio 或 Gradle 等工具。
      這顯著降低了團隊的入門門檻。</td>
<td>
  <list>
    <li>iOS 開發人員的工作流程較慢，因為編輯和建置共享程式碼的過程涉及發布和版本控制。</li>
   <li>在 iOS 上調試共享 Kotlin 程式碼很困難。</li>
   <li>iOS 團隊成員對共享程式碼的貢獻的可能性顯著降低。</li>
   <li>共享程式碼的維護完全由參與的團隊成員負責。</li>
  </list>
</td>
</tr>

</table>

#### 為本機開發設定本機依賴

許多團隊在採用 Kotlin Multiplatform 技術時選擇遠端分發工作流程，以保持 iOS 開發人員的開發過程不變。但是，在這種工作流程中，他們很難更改 Kotlin Multiplatform 程式碼。我們建議設定一個額外的「本機開發」工作流程，其中包含對從 Kotlin Multiplatform 模組生成的框架的本機依賴。

當開發人員添加新功能時，他們會切換到將 Kotlin Multiplatform 模組作為本機依賴來消費。這允許更改通用 Kotlin 程式碼，立即觀察 iOS 中的行為，並調試 Kotlin 程式碼。當功能準備好時，他們可以切換回遠端依賴並相應地發布其更改。首先，他們發布對共享模組的更改，然後才對應用程式進行更改。

對於遠端分發工作流程，請使用 Swift 套件管理器。對於本機分發工作流程，直接整合框架。

<!-- This tutorial [TODO] describes how to switch workflows by choosing the corresponding scheme in Xcode:
[TODO screenshot] -->

如果你使用 CocoaPods，你可以選擇使用 CocoaPods 進行本機分發工作流程。你可以透過更改環境變數來切換它們，如 [TouchLab 文件](https://touchlab.co/kmmbridgecocoapodslocal)所述。