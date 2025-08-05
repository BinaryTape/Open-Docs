[//]: # (title: 設定環境)

在建立您的第一個 Kotlin Multiplatform 應用程式之前，您需要為 KMP 開發設定一個環境。

## 安裝必要的工具

建議您安裝最新的穩定版本，以獲得相容性和更佳的效能。

<table>
   <tr>
      <td>工具</td>
      <td>評論</td>
   </tr>
    <tr>
        <td><a href="https://developer.android.com/studio">Android Studio</a></td>
        <td>您將使用 Android Studio 建立您的多平台應用程式，並在模擬器或硬體裝置上執行它們。</td>
    </tr>
    <tr>
        <td>
          <p><a href="https://apps.apple.com/us/app/xcode/id497799835">Xcode</a></p>
          <p>如果您想在模擬器或實體裝置上執行 iOS 應用程式，則需要 Xcode。如果您使用不同的作業系統，請跳過此工具。</p>
        </td>
        <td>
          <p>在獨立視窗中啟動 Xcode 以接受其授權條款並允許它執行一些必要的初始任務。</p>
          <p>大多數情況下，Xcode 將在背景執行。您將使用它來將 Swift 或 Objective-C 程式碼新增到您的 iOS 應用程式中。</p>
            <note>
              <p>
                我們通常建議所有工具都使用最新的穩定版本。然而，Kotlin/Native 有時無法立即支援最新的 Xcode。您可以在<a href="multiplatform-compatibility-guide.md#version-compatibility">相容性指南</a>中查看支援的版本，如有必要，可以<a href="https://developer.apple.com/download/all/?q=Xcode">安裝較舊版本的 Xcode</a>。
              </p>
            </note>   
      </td>
   </tr>
   <tr>
        <td><a href="https://www.oracle.com/java/technologies/javase-downloads.html">JDK</a></td>
        <td>若要檢查 Java 是否已安裝，請在 Android Studio 終端機或您的命令列中執行以下命令：<code style="block"
            lang="bash">java -version</code></td>
   </tr>
   <tr>
        <td><a href="multiplatform-plugin-releases.md">Kotlin Multiplatform plugin</a></td>
        <td><p>在 Android Studio 中，開啟 <strong>設定</strong> (<strong>偏好設定</strong>) 並找到 <strong>外掛程式</strong> 頁面。在 <strong>Marketplace</strong> 分頁中搜尋 <i>Kotlin Multiplatform</i>，然後安裝它。</p>
</td>
   </tr>
   <tr>
        <td><a href="https://kotlinlang.org/docs/releases.html#update-to-a-new-release">Kotlin plugin</a></td>
        <td>
            <p>Kotlin 外掛程式隨每個 Android Studio 版本捆綁並自動更新。</p>
        </td>
   </tr>
</table>

## 檢查您的環境

為了確保一切正常運作，請安裝並執行 KDoctor 工具：

> KDoctor 僅適用於 macOS。如果您使用不同的作業系統，請跳過此步驟。
>
{style="note"}

1. 在 Android Studio 終端機或您的命令列工具中，執行以下命令以使用 Homebrew 安裝該工具：

    ```bash
    brew install kdoctor
    ```

   如果您尚未安裝 Homebrew，請[安裝它](https://brew.sh/)或查閱 KDoctor 的 [README](https://github.com/Kotlin/kdoctor#installation) 以了解其他安裝方式。
2. 安裝完成後，在主控台中呼叫 KDoctor： 

    ```bash
    kdoctor
    ```

3. 如果 KDoctor 在檢查您的環境時診斷出任何問題，請檢查輸出以了解問題和可能的解決方案：

   * 修正任何失敗的檢查 (`[x]`)。您可以在 `*` 符號後找到問題描述和潛在解決方案。
   * 檢查警告 (`[!]`) 和成功訊息 (`[v]`)。它們也可能包含有用的備註和提示。
   
   > 您可以忽略 KDoctor 關於 CocoaPods 安裝的警告。在您的第一個專案中，您將使用不同的 iOS 框架分發選項。
   >
   {style="tip"}

## 可能的問題與解決方案

<deflist collapsible="true">
   <def title="Kotlin 與 Android Studio">
      <list>
         <li>確保您已安裝 Android Studio。您可以從其<a href="https://developer.android.com/studio">官方網站</a>取得。</li>
         <li>您可能會遇到 <code>Kotlin not configured</code> 錯誤。這是 Android Studio Giraffe 2022.3 中一個已知問題，不會影響專案的建置和執行。為避免此錯誤，請點擊 <strong>忽略</strong> 或升級到 Android Studio Hedgehog 2023.1。</li>
         <li>若要使用最新的 Compose Multiplatform 共享 UI 程式碼，您的專案請至少使用 Kotlin 2.1.0 (目前版本為 %kotlinVersion%)，並且也要依賴於至少針對 Kotlin 2.1.0 編譯的函式庫。否則，您可能會遇到連結錯誤。</li>
      </list>
   </def>
   <def title="Java 與 JDK">
         <list>
           <li>確保您已安裝 JDK。您可以從其<a href="https://www.oracle.com/java/technologies/javase-downloads.html">官方網站</a>取得。</li>
           <li>Android Studio 使用捆綁的 JDK 來執行 Gradle 任務。若要在 Android Studio 中設定 Gradle JDK，請選擇 <strong>設定/偏好設定 | 建置、執行、部署 | 建置工具 | Gradle</strong>。</li>
           <li>您可能會遇到與 <code>JAVA_HOME</code> 相關的問題。此環境變數指定 Xcode 和 Gradle 所需的 Java 二進位檔位置。如果是，請遵循 KDoctor 的提示來解決這些問題。</li>
         </list>
   </def>
   <def title="Xcode">
      <list>
         <li>確保您已安裝 Xcode。您可以從其<a href="https://developer.apple.com/xcode/">官方網站</a>取得。</li>
         <li>如果您尚未啟動 Xcode，請在獨立視窗中開啟它。接受授權條款並允許它執行一些必要的初始任務。</li>
         <li><p>您可能會遇到 <code>Error: can't grab Xcode schemes</code> 錯誤或關於命令列工具選擇的其他問題。在這種情況下，請執行以下其中一項操作：</p>
             <list>
               <li><p>在終端機中，執行：</p>
                   <code style="block"
                         lang="bash">sudo xcode-select --switch /Applications/Xcode.app</code>
               </li>
               <li>或者，在 Xcode 中，選擇 <strong>設定 | 位置</strong>。在 <strong>命令列工具</strong> 欄位中，選擇您的 Xcode 版本。
                   <img src="xcode-schemes.png" alt="Xcode 方案" width="500"/>
                   <p>確保已選擇 <code>Xcode.app</code> 的路徑。如果需要，在獨立視窗中確認操作。</p>
               </li>
             </list>
         </li>
      </list>
   </def>
   <def title="Kotlin 外掛程式">
         <snippet>
            <p><strong>Kotlin Multiplatform 外掛程式</strong></p>
               <list>
                  <li>確保 Kotlin Multiplatform 外掛程式已安裝並啟用。在 Android Studio 歡迎畫面中，選擇 <strong>外掛程式 | 已安裝</strong>。驗證您已啟用該外掛程式。如果它不在 <strong>已安裝</strong> 清單中，請在 <strong>Marketplace</strong> 中搜尋並安裝該外掛程式。</li>
                  <li>如果外掛程式已過時，請點擊外掛程式名稱旁邊的 <strong>更新</strong>。您也可以在 <strong>設定/偏好設定 | 工具 | 外掛程式</strong> 部分中執行相同的操作。</li>
                  <li>在<a href="multiplatform-plugin-releases.md#release-details">發佈詳細資訊</a>表中檢查 Kotlin Multiplatform 外掛程式與您的 Kotlin 版本的相容性。</li>
               </list>
         </snippet>
         <snippet>
            <p><strong>Kotlin 外掛程式</strong></p>
            <p>確保 Kotlin 外掛程式已更新到最新版本。為此，在 Android Studio 歡迎畫面中，選擇 <strong>外掛程式 | 已安裝</strong>。點擊 Kotlin 旁邊的 <strong>更新</strong>。</p>
         </snippet>
   </def>
   <def title="命令列">
            <p>確保您已安裝所有必要的工具：</p>
            <list>
              <li><code>command not found: brew</code> – <a href="https://brew.sh/">安裝 Homebrew</a>。</li>
              <li><code>command not found: java</code> – <a href="https://www.oracle.com/java/technologies/javase-downloads.html">安裝 Java</a>。</li>
           </list>
    </def>
   <def title="仍然遇到問題？">
            <p>透過<a href="https://kotl.in/issue">建立 YouTrack 問題</a>向團隊分享您的問題。</p>
   </def>
</deflist>

## 取得協助

* **Kotlin Slack**。取得[邀請函](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)並加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道。
* **Kotlin 問題追蹤器**。[報告新問題](https://youtrack.jetbrains.com/newIssue?project=KT)。