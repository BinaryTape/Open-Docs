[//]: # (title: Kotlin 多平台範例)
<show-structure for="none"/>

這是一份精選的專案列表，旨在展示 Kotlin 多平台的強大與獨特應用。

> 我們目前不接受對此頁面的貢獻。
> 若要將您的專案標記為 Kotlin 多平台範例，請在 GitHub 上使用 [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample) 主題。
> 請參閱 [GitHub 文件](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics#adding-topics-to-your-repository)，了解如何在主題中展示您的專案。
>
{style="note"}

有些專案使用 Compose Multiplatform 共享幾乎所有用於使用者介面的程式碼。
其他專案則使用原生程式碼來處理使用者介面，並僅共享例如資料模型和演算法。
若要建立您全新的 Kotlin 多平台應用程式，我們建議使用 [網路精靈](https://kmp.jetbrains.com)。

您可以在 GitHub 上透過 [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample) 主題找到更多範例專案。
若要探索整個生態系統，請查看 [kotlin-multiplatform](https://github.com/topics/kotlin-multiplatform) 主題。

### JetBrains 官方範例

<table>
    
<tr>
<td>名稱</td>
        <td>說明</td>
        <td>共享內容</td>
        <td>值得注意的函式庫</td>
        <td>使用者介面</td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer">Image Viewer</a></strong>
        </td>
        <td>一個用於擷取、檢視和儲存圖片的應用程式。支援地圖功能。UI 使用 Compose
            Multiplatform。於 <a href="https://www.youtube.com/watch?v=FWVi4aV36d8">KotlinConf 2023</a> 首次推出。
        </td>
        <td>
            <list>
                <li>使用者介面 (UI)</li>
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
                <li>iOS、桌面和網頁上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JetBrains/compose-multiplatform/tree/master/examples/chat">Chat</a></strong>
        </td>
        <td>一個展示如何在 SwiftUI 介面中嵌入 Compose Multiplatform 元件的範例。使用案例為線上訊息傳遞。
        </td>
        <td>
            <list>
                <li>使用者介面 (UI)</li>
                <li>模型</li>
                <li>網路</li>
            </list>
        </td>
        <td/>
        <td>
            <list>
                <li>Android 上的 Jetpack Compose</li>
                <li>iOS、桌面和網頁上的 Compose Multiplatform</li>
                <li>iOS 上的 SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/Kotlin/kmm-production-sample">KMM RSS Reader</a></strong>
        </td>
        <td>一個用於消費 RSS 訂閱的範例應用程式，旨在展示 Kotlin 多平台如何在生產環境中使用。使用者介面 (UI) 是原生實作的，但有一個實驗性分支展示了 Compose
            Multiplatform 如何在 iOS 和桌面上使用。網路功能透過
            <a href="https://ktor.io/docs/create-client.html">Ktor HTTP Client</a> 完成，而 XML 解析則原生實作。Redux 架構用於共享 UI 狀態。
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
                <li>iOS 和桌面上的 Compose Multiplatform (在實驗性分支中)</li>
                <li>iOS 上的 SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/Kotlin/kmm-basic-sample">Kotlin Multiplatform Sample</a></strong>
        </td>
        <td>一個簡單的計算機應用程式。展示了如何使用 expected 和 actual 宣告來整合 Kotlin 和原生程式碼。
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
        <td>說明</td>
        <td>共享內容</td>
        <td>值得注意的函式庫</td>
        <td>使用者介面</td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/joreilly/Confetti">Confetti</a></strong>
        </td>
        <td>一個展示 Kotlin 多平台和 Compose Multiplatform 多方面功能的專案。使用案例為一個用於擷取和顯示會議日程資訊的應用程式。支援
            Wear 和 Auto 平台。客戶端-伺服器通訊使用 GraphQL。架構在 <a href="https://www.youtube.com/watch?v=uATlWUBSx8Q">KotlinConf 2023</a> 上有深入討論。
        </td>
        <td>
            <list>
                <li>使用者介面 (UI)</li>
                <li>模型</li>
                <li>網路</li>
                <li>資料儲存</li>
                <li>導航</li>
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
                <li>Android、Auto 和 Wear 上的 Jetpack Compose</li>
                <li>iOS、桌面和網頁上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/joreilly/PeopleInSpace">People In Space</a></strong>
        </td>
        <td>一個展示 Kotlin 多平台可以在許多不同平台上運行的專案。使用案例為顯示目前在太空中的人數以及國際太空站的位置。
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
                <li>Android 和 Wear OS 上的 Jetpack Compose</li>
                <li>iOS、桌面和網頁上的 Compose Multiplatform</li>
                <li>iOS 和 macOS 上的 SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/touchlab/DroidconKotlin">Sessionize / Droidcon</a></strong>
        </td>
        <td>一個使用 Sessionize API 檢視 Droidcon 活動議程的應用程式。可客製化用於任何在 Sessionize 中儲存演講的活動。與 Firebase 整合，因此需要 Firebase 帳戶才能運行。
        </td>
        <td>
            <list>
                <li>使用者介面 (UI)</li>
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
        <td>一個用於 Kotlin 多平台開發的程式碼和工具集合。旨在展示建構 Kotlin 多平台應用程式時的函式庫、架構選擇和最佳實踐。使用案例為下載和顯示狗品種資訊。在該 <a href="https://www.youtube.com/watch?v=EJVq_QWaWXE">影片教學</a> 中首次推出。
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
        <td>說明</td>
        <td>共享內容</td>
        <td>值得注意的函式庫</td>
        <td>使用者介面</td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/xxfast/NYTimes-KMP">NYTimes KMP</a></strong>
        </td>
        <td>一個基於 Compose Multiplatform 的 New York Times 應用程式版本。允許使用者瀏覽和閱讀文章。請注意，要建置和運行應用程式，您需要 <a href="https://developer.nytimes.com/">來自 The New York Times 的 API 密鑰</a>。
        </td>
        <td>
            <list>
                <li>使用者介面 (UI)</li>
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
                <li>Android 和 Wear 上的 Jetpack Compose</li>
                <li>iOS、桌面和網頁上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JoelKanyi/FocusBloom">Focus Bloom</a></strong>
        </td>
        <td>一個生產力與時間管理應用程式。允許使用者安排任務並提供關於其成就的回饋。
        </td>
        <td>
            <list>
                <li>使用者介面 (UI)</li>
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
                <li>Android、iOS 和桌面上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/SEAbdulbasit/recipe-app">Recipe App</a></strong>
        </td>
        <td>一個用於檢視食譜的示範應用程式。展示了動畫的使用。</td>
        <td>
            <list>
                <li>使用者介面 (UI)</li>
                <li>模型</li>
                <li>資料儲存</li>
            </list>
        </td>
        <td><p><code>kotlinx-coroutines</code></p></td>
        <td>
            <list>
                <li>Android 上的 Jetpack Compose</li>
                <li>iOS、桌面和網頁上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/dbaroncelli/D-KMP-sample">D-KMP-sample</a></strong>
        </td>
        <td>一個用於 <a href="https://danielebaroncelli.medium.com/d-kmp-sample-now-leverages-ios-16-navigation-cebbb81ba2e7">
            具備 Kotlin 多平台的宣告式 UI 架構</a> 的範例應用程式。使用案例為擷取和顯示不同國家的疫苗接種統計數據。
        </td>
        <td>
            <list>
                <li>網路</li>
                <li>資料儲存</li>
                <li>ViewModel</li>
                <li>導航</li>
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
        <td>一個從 <a href="https://www.themoviedb.org/">The Movie Database</a> 消費數據的應用程式，用於顯示當前熱門、即將上映和受歡迎的電影與電視節目。需要您建立一個 The Movie Database 的 API 密鑰。
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
        <td>Twine 是一個使用 Kotlin 和 Compose Multiplatform 建置的多平台 RSS 閱讀器應用程式。它具有良好的使用者介面和體驗，可瀏覽訂閱源，並支援基於 Material 3 內容的動態主題。
        </td>
        <td>
            <list>
                <li>模型</li>
                <li>網路</li>
                <li>資料儲存</li>
                <li>使用者介面 (UI)</li>
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
                <li>Android 和 iOS 上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/razaghimahdi/Shopping-By-KMP">Shopping By KMP</a></strong>
        </td>
        <td>一個使用 Jetpack Compose Multiplatform 建置的跨平台應用程式，Jetpack Compose Multiplatform 是一個用於在多個平台之間共享 UI 的宣告式框架，支援 Kotlin。該應用程式允許使用者在 Android、iOS、網頁、桌面、Android Automotive 和 Android TV 上瀏覽、搜尋和購買購物目錄中的產品。
        </td>
        <td>
            <list>
                <li>模型</li>
                <li>網路</li>
                <li>資料儲存</li>
                <li>使用者介面 (UI)</li>
                <li>ViewModel</li>
                <li>動畫</li>
                <li>導航</li>
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
                <li>Android、iOS、網頁、桌面、Automotive 和 Android TV 上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/SEAbdulbasit/MusicApp-KMP">Music App KMP</a></strong>
        </td>
        <td>一個應用程式，展示了如何在不同平台上與 MediaPlayer 等原生 API 互動。它使用 Spotify API 獲取數據。
        </td>
        <td>
            <list>
                <li>模型</li>
                <li>網路</li>
                <li>使用者介面 (UI)</li>
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
                <li>Android、iOS、桌面和網頁上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/fethij/Rijksmuseum">Rijksmuseum</a></strong>
        </td>
        <td>Rijksmuseum 是一個多模組的 Kotlin 和 Compose Multiplatform 應用程式，它提供了一種沉浸式的方式來探索阿姆斯特丹著名國家博物館的藝術收藏。它利用 Rijksmuseum API 來擷取和顯示有關各種藝術品的詳細資訊，包括圖片和描述。
        </td>
        <td>
            <list>
                <li>使用者介面 (UI)</li>
                <li>模型</li>
                <li>網路</li>
                <li>導航</li>
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
                <li>Android、iOS、桌面和網頁上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

</table>