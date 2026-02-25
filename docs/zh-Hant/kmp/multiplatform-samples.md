[//]: # (title: Kotlin Multiplatform 範例)
<show-structure for="none"/>

這是一個精選專案清單，旨在展示 Kotlin Multiplatform 強大且獨特的應用。

> 我們目前不接受對此頁面的貢獻。
> 若要將您的專案作為 Kotlin Multiplatform 範例展示，請在 GitHub 上使用 [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample) 主題。
> 請參閱 [GitHub 文件](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics#adding-topics-to-your-repository)
以了解如何在主題中展示您的專案。
>
{style="note"}

一些專案使用 Compose Multiplatform 作為使用者介面，共用了幾乎所有的程式碼。
其他專案則在使用者介面使用原生程式碼，僅共用例如資料模型和演算法等部分。
若要建立您自己的全新 Kotlin Multiplatform 應用程式，我們建議使用 [web 精靈](https://kmp.jetbrains.com)。

您可以在 GitHub 上透過 [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample) 主題找到更多範例專案。
若要探索整個生態系統，請查看 [kotlin-multiplatform](https://github.com/topics/kotlin-multiplatform) 主題。

### JetBrains 官方範例

<table>
    
<tr>
<td>名稱</td>
        <td>描述</td>
        <td>共用內容</td>
        <td>值得關注的程式庫</td>
        <td>使用者介面</td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JetBrains/kotlinconf-app">官方 KotlinConf 應用程式</a></strong>
        </td>
        <td><a href="https://kotlinconf.com/">KotlinConf</a> 的伴隨應用程式。
            其 Android、iOS、桌面與 Web 的用戶端應用程式是使用 Compose Multiplatform 以共用 UI 方式建置。
            後端應用程式則由 <a href="https://ktor.io/">Ktor</a> 伺服器端架構
            與 <a href="https://www.jetbrains.com/help/exposed/home.html">Exposed</a> 資料庫程式庫支援。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>模型</li>
                <li>網路</li>
                <li>資料儲存</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-serialization</code></li>
                <li><code>kotlinx-datetime</code></li>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>ktor-client</code></li>
                <li><code>ktor-server</code></li>
                <li><code>multiplatform-settings</code></li>
            </list>
        </td>
        <td>
            <list>
                <li>Android 上的 Jetpack Compose</li>
                <li>iOS、桌面與 Web 上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer">Image Viewer</a></strong>
        </td>
        <td>一個用於拍攝、檢視與儲存圖片的應用程式。包含地圖支援。UI 使用 Compose Multiplatform。於 <a href="https://www.youtube.com/watch?v=FWVi4aV36d8">KotlinConf 2023</a> 推出。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>模型</li>
                <li>網路</li>
                <li>動畫</li>
                <li>資料儲存</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-serialization</code></li>
                <li><code>kotlinx-datetime</code></li>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>play-services-maps</code></li>
                <li><code>play-services-locations</code></li>
                <li><code>android-maps-compose</code></li>
                <li><code>accompanist-permissions</code></li>
            </list>
        </td>
        <td>
            <list>
                <li>Android 上的 Jetpack Compose</li>
                <li>iOS、桌面與 Web 上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JetBrains/compose-multiplatform/tree/master/examples/chat">Chat</a></strong>
        </td>
        <td>展示如何在 SwiftUI 介面中內嵌 Compose Multiplatform 元件。使用案例為線上通訊。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>模型</li>
                <li>網路</li>
            </list>
        </td>
        <td/>
        <td>
            <list>
                <li>Android 上的 Jetpack Compose</li>
                <li>iOS、桌面與 Web 上的 Compose Multiplatform</li>
                <li>iOS 上的 SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/kotlin-hands-on/jetcaster-kmp-migration">Jetcaster Multiplatform</a></strong>
        </td>
        <td>將 Compose 範例應用程式 <a href="https://github.com/android/compose-samples/tree/main/Jetcaster">Jetcaster</a> 
            改為多平台版本，在原始的 Android 版本中加入了 iOS 與桌面目標。
            UI 已遷移至 Compose Multiplatform，且多個程式庫已被多平台版本或替代方案取代。
            遷移的考量與過程已在 <a href="https://kotlinlang.org/docs/multiplatform/migrate-from-android.html">Jetcaster 遷移教學</a>中說明。
        </td>
        <td>
            <list>
                <li>模型</li>
                <li>網路</li>
                <li>UI</li>
                <li>資料儲存</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>coil</code></li>
                <li><code>koin</code></li>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>kotlinx-datetime</code></li>
                <li><code>kotlin-test</code></li>
                <li><code>ktor-client</code></li>
                <li>Room</li>
            </list>
        </td>
        <td>
            <list>
                <li>Android、iOS 與桌面上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/Kotlin/kmm-production-sample">KMM RSS Reader</a></strong>
        </td>
        <td>一個用於讀取 RSS 來源的範例應用程式，旨在展示 Kotlin Multiplatform 如何應用於生產環境。UI 以原生方式實作，但有一個實驗性分支展示了如何在 iOS 與桌面上使用 Compose Multiplatform。網路功能透過 
            <a href="https://ktor.io/docs/create-client.html">Ktor HTTP 用戶端</a>實現，而 XML 剖析則以原生方式實作。UI 狀態 (UI State) 的共用採用了 Redux 架構。
        </td>
        <td>
            <list>
                <li>模型</li>
                <li>網路</li>
                <li>UI 狀態</li>
                <li>資料儲存</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-serialization</code></li>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>ktor-client</code></li>
                <li><code>voyager</code></li>
                <li><code>coil</code></li>
                <li><code>multiplatform-settings</code></li>
                <li><code>napier</code></li>
                <li>SQLDelight</li>
            </list>
        </td>
        <td>
            <list>
                <li>Android 上的 Jetpack Compose</li>
                <li>iOS 與桌面上的 Compose Multiplatform（位於實驗性分支）</li>
                <li>iOS 上的 SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/Kotlin/kmm-basic-sample">Kotlin Multiplatform Sample</a></strong>
        </td>
        <td>一個簡單的計算機應用程式。展示如何使用 <code>expected</code> 與 <code>actual</code> 宣告將 Kotlin 與原生程式碼整合。
        </td>
        <td><p>演算法</p></td>
        <td/>
        <td>
            <list>
                <li>Android 上的 Jetpack Compose</li>
                <li>SwiftUI</li>
            </list>
        </td>
</tr>

</table>

### 推薦範例

<table>
    
<tr>
<td>名稱</td>
        <td>描述</td>
        <td>共用內容</td>
        <td>值得關注的程式庫</td>
        <td>使用者介面</td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/joreilly/Confetti">Confetti</a></strong>
        </td>
        <td>展示 Kotlin Multiplatform 與 Compose Multiplatform 許多不同面向的作品。使用案例為一個用於獲取並顯示研討會日程資訊的應用程式。包含對 Wear 與 Auto 平台的支援。使用 GraphQL 進行用戶端-伺服器通訊。其架構在 <a href="https://www.youtube.com/watch?v=uATlWUBSx8Q">KotlinConf 2023</a> 中有深入探討。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>模型</li>
                <li>網路</li>
                <li>資料儲存</li>
                <li>導覽</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-serialization</code></li>
                <li><code>kotlinx-datetime</code></li>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>decompose</code></li>
                <li><code>koin</code></li>
                <li><code>jsonpathkt-kotlinx</code></li>
                <li><code>horologist</code></li>
                <li><code>google-cloud</code></li>
                <li><code>firebase</code></li>
                <li><code>bare-graphql</code></li>
                <li><code>apollo</code></li>
                <li><code>accompanist</code></li>
            </list>
        </td>
        <td>
            <list>
                <li>Android、Auto 與 Wear 上的 Jetpack Compose</li>
                <li>iOS、桌面與 Web 上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/joreilly/PeopleInSpace">People In Space</a></strong>
        </td>
        <td>展示 Kotlin Multiplatform 可以執行的多種不同平台。使用案例為顯示目前在太空中的人數以及國際太空站的位置。
        </td>
        <td>
            <list>
                <li>模型</li>
                <li>網路</li>
                <li>資料儲存</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-serialization</code></li>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>kotlinx-datetime</code></li>
                <li><code>ktor-client</code></li>
                <li><code>koin</code></li>
                <li><code>multiplatform-settings</code></li>
                <li>SQLDelight</li>
            </list>
        </td>
        <td>
            <list>
                <li>Android 與 Wear OS 上的 Jetpack Compose</li>
                <li>iOS、桌面與 Web 上的 Compose Multiplatform</li>
                <li>iOS 與 macOS 上的 SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/touchlab/DroidconKotlin">Sessionize / Droidcon</a></strong>
        </td>
        <td>一個使用 Sessionize API 查看 Droidcon 活動議程的應用程式。可以針對任何在 Sessionize 中儲存演講資訊的活動進行自訂。與 Firebase 整合，因此執行時需要 Firebase 帳戶。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>模型</li>
                <li>網路</li>
                <li>資料儲存</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>kotlinx-datetime</code></li>
                <li><code>ktor-client</code></li>
                <li><code>koin</code></li>
                <li><code>multiplatform-settings</code></li>
                <li><code>firebase</code></li>
                <li><code>kermit</code></li>
                <li><code>accompanist</code></li>
                <li><code>hyperdrive-multiplatformx</code></li>
                <li>SQLDelight</li>
            </list>
        </td>
        <td>
            <list>
                <li>Android 上的 Jetpack Compose</li>
                <li>iOS 上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/touchlab/KaMPKit">KaMPKit</a></strong>
        </td>
        <td>一組用於 Kotlin Multiplatform 開發的程式碼與工具。旨在展示建置 Kotlin Multiplatform 應用程式時的程式庫、架構選擇與最佳實務。使用案例為下載並顯示狗品種的資訊。已在此 <a href="https://www.youtube.com/watch?v=EJVq_QWaWXE">影片教學</a>中介紹。
        </td>
        <td>
            <list>
                <li>模型</li>
                <li>網路</li>
                <li>ViewModel</li>
                <li>資料儲存</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>ktor-client</code></li>
                <li><code>koin</code></li>
                <li><code>multiplatform-settings</code></li>
                <li><code>kermit</code></li>
                <li>SQLDelight</li>
            </list>
        </td>
        <td>
            <list>
                <li>Android 上的 Jetpack Compose</li>
                <li>iOS 上的 SwiftUI</li>
            </list>
        </td>
</tr>

</table>

### 其他社群範例

<table>
    
<tr>
<td>名稱</td>
        <td>描述</td>
        <td>共用內容</td>
        <td>值得關注的程式庫</td>
        <td>使用者介面</td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/xxfast/NYTimes-KMP">NYTimes KMP</a></strong>
        </td>
        <td>一個基於 Compose Multiplatform 的紐約時報 (New York Times) 應用程式版本。允許使用者瀏覽與閱讀文章。請注意，若要建置並執行此應用程式，您需要一個 <a href="https://developer.nytimes.com/">紐約時報的 API 金鑰</a>。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>模型</li>
                <li>網路</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-serialization</code></li>
                <li><code>kotlinx-datetime</code></li>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>ktor-client</code></li>
                <li><code>molecule</code></li>
                <li><code>decompose</code></li>
                <li><code>horologist</code></li>
            </list>
        </td>
        <td>
            <list>
                <li>Android 與 Wear 上的 Jetpack Compose</li>
                <li>iOS、桌面與 Web 上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JoelKanyi/FocusBloom">Focus Bloom</a></strong>
        </td>
        <td>一個生產力與時間管理應用程式。允許使用者排定任務並提供其成就的回饋。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>模型</li>
                <li>動畫</li>
                <li>資料儲存</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx.serialization</code></li>
                <li><code>kotlinx.coroutines</code></li>
                <li><code>kotlinx.datetime</code></li>
                <li><code>koin</code></li>
                <li><code>navigation-compose</code></li>
                <li><code>multiplatform-settings</code></li>
                <li>SQLDelight</li>
            </list>
        </td>
        <td>
            <list>
                <li>Android、iOS 與桌面上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/SEAbdulbasit/recipe-app">Recipe App</a></strong>
        </td>
        <td>一個用於檢視食譜的展示應用程式。展示了動畫的使用。</td>
        <td>
            <list>
                <li>UI</li>
                <li>模型</li>
                <li>資料儲存</li>
            </list>
        </td>
        <td><p><code>kotlinx-coroutines</code></p></td>
        <td>
            <list>
                <li>Android 上的 Jetpack Compose</li>
                <li>iOS、桌面與 Web 上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/dbaroncelli/D-KMP-sample">D-KMP-sample</a></strong>
        </td>
        <td>一個展示 <a href="https://danielebaroncelli.medium.com/d-kmp-sample-now-leverages-ios-16-navigation-cebbb81ba2e7">
            宣告式 UI 與 Kotlin MultiPlatform 架構</a> 的範例應用程式。使用案例為檢索並顯示不同國家的疫苗接種統計數據。
        </td>
        <td>
            <list>
                <li>網路</li>
                <li>資料儲存</li>
                <li>ViewModel</li>
                <li>導覽</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>ktor-client</code></li>
                <li><code>multiplatform-settings</code></li>
                <li>SQLDelight</li>
            </list>
        </td>
        <td>
            <list>
                <li>Android 上的 Jetpack Compose</li>
                <li>iOS 上的 SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/VictorKabata/Notflix">Notflix</a></strong>
        </td>
        <td>一個從 <a href="https://www.themoviedb.org/">The Movie Database</a> 獲取資料以顯示目前趨勢、即將上映以及熱門電影與電視節目的應用程式。需要您在 The Movie Database 建立 API 金鑰。
        </td>
        <td>
            <list>
                <li>模型</li>
                <li>網路</li>
                <li>快取</li>
                <li>ViewModel</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>kotlinx-serialization</code></li>
                <li><code>kotlinx-datetime</code></li>
                <li><code>ktor-client</code></li>
                <li><code>multiplatform-settings</code></li>
                <li><code>napier</code></li>
            </list>
        </td>
        <td>
            <list>
                <li>Android 上的 Jetpack Compose</li>
                <li>iOS 上的 SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/msasikanth/twine">Twine - RSS Reader</a></strong>
        </td>
        <td>Twine 是一個使用 Kotlin 與 Compose Multiplatform 建置的多平台 RSS 閱讀器應用程式。它具有優美的使用者介面與體驗來瀏覽訂閱源，並支援 Material 3 基於內容的動態佈景主題。
        </td>
        <td>
            <list>
                <li>模型</li>
                <li>網路</li>
                <li>資料儲存</li>
                <li>UI</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>kotlinx-serialization</code></li>
                <li><code>kotlinx-datetime</code></li>
                <li><code>ktor-client</code></li>
                <li><code>napier</code></li>
                <li><code>decompose</code></li>
            </list>
        </td>
        <td>
            <list>
                <li>Android 與 iOS 上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/razaghimahdi/Shopping-By-KMP">Shopping By KMP</a></strong>
        </td>
        <td>一個使用 Jetpack Compose Multiplatform 建置的跨平台應用程式，這是一個透過 Kotlin 在多個平台間共用 UI 的宣告式架構。該應用程式允許使用者在 Android、iOS、Web、桌面、Android Automotive 與 Android TV 上瀏覽、搜尋與購買購物目錄中的產品。
        </td>
        <td>
            <list>
                <li>模型</li>
                <li>網路</li>
                <li>資料儲存</li>
                <li>UI</li>
                <li>ViewModel</li>
                <li>動畫</li>
                <li>導覽</li>
                <li>UI 狀態</li>
                <li>使用案例</li>
                <li>單元測試</li>
                <li>UI 測試</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>kotlinx-serialization</code></li>
                <li><code>kotlinx-datetime</code></li>
                <li><code>ktor-client</code></li>
                <li><code>datastore</code></li>
                <li><code>koin</code></li>
                <li><code>google-map</code></li>
                <li><code>navigation-compose</code></li>
                <li><code>coil</code></li>
                <li><code>kotest</code></li>
            </list>
        </td>
        <td>
            <list>
                <li>Android、iOS、Web、桌面、Automotive 與 Android TV 上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/SEAbdulbasit/MusicApp-KMP">Music App KMP</a></strong>
        </td>
        <td>一個展示如何在不同平台上與原生 API（如 MediaPlayer）互動的應用程式。它使用 Spotify API 來獲取資料。
        </td>
        <td>
            <list>
                <li>模型</li>
                <li>網路</li>
                <li>UI</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>kotlinx-serialization</code></li>
                <li><code>ktor-client</code></li>
                <li><code>decompose</code></li>
            </list>
        </td>
        <td>
            <list>
                <li>Android、iOS、桌面與 Web 上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/fethij/Rijksmuseum">Rijksmuseum</a></strong>
        </td>
        <td>Rijksmuseum 是一個多模組化 (multimodular) 的 Kotlin 與 Compose Multiplatform 應用程式，提供了一種沈浸式的方式來探索阿姆斯特丹著名的荷蘭國立博物館 (Rijksmuseum) 的藝術收藏。它利用 Rijksmuseum API 來獲取並顯示各種藝術作品的詳細資訊，包括圖片與描述。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>模型</li>
                <li>網路</li>
                <li>導覽</li>
                <li>ViewModel</li>
            </list>
        </td>
        <td>
            <list>
                <li><code>kotlinx-coroutines</code></li>
                <li><code>kotlinx-serialization</code></li>
                <li><code>ktor-client</code></li>
                <li><code>koin</code></li>
                <li><code>navigation-compose</code></li>
                <li><code>Coil</code></li>
                <li><code>Jetpack ViewModel</code></li>
            </list>
        </td>
        <td>
            <list>
                <li>Android、iOS、桌面與 Web 上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

</table>