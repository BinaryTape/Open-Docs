[//]: # (title: Kotlin Multiplatform 示例)
<show-structure for="none"/>

这是一个精选的项目列表，旨在展示 Kotlin Multiplatform 强健且独特的应用。

> 我们目前不接受对此页面的贡献。
> 要将您的项目作为 Kotlin Multiplatform 示例进行展示，请在 GitHub 上使用 [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample) 话题。
> 请参阅 [GitHub 文档](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics#adding-topics-to-your-repository) 以了解如何在话题中展示您的项目。
>
{style="note"}

一些项目使用 Compose Multiplatform 为用户界面共享了几乎所有的代码。
另一些项目则为用户界面使用原生代码，例如仅共享数据模型和算法。
要创建您自己的全新 Kotlin Multiplatform 应用程序，我们建议使用 [Web 向导](https://kmp.jetbrains.com)。

您可以通过 [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample) 话题在 GitHub 上找到更多示例项目。
要探索整个生态系统，请查看 [kotlin-multiplatform](https://github.com/topics/kotlin-multiplatform) 话题。

### JetBrains 官方示例

<table>
    
<tr>
<td>名称</td>
        <td>描述</td>
        <td>共享内容</td>
        <td>值得关注的库</td>
        <td>用户界面</td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JetBrains/kotlinconf-app">官方 KotlinConf 应用</a></strong>
        </td>
        <td><a href="https://kotlinconf.com/">KotlinConf</a> 的伴侣应用。
            适用于 Android、iOS、桌面端和 Web 的客户端应用程序是使用 Compose Multiplatform 通过共享 UI 构建的。
            后端应用程序由 <a href="https://ktor.io/">Ktor</a> 服务器端框架和 <a href="https://www.jetbrains.com/help/exposed/home.html">Exposed</a> 数据库库驱动。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>模型</li>
                <li>网络</li>
                <li>数据存储</li>
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
                <li>iOS、桌面端和 Web 上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer">图像查看器 (Image Viewer)</a></strong>
        </td>
        <td>一个用于拍摄、查看和存储图片的应用程序。包括对地图的支持。为 UI 使用 Compose Multiplatform。在 <a href="https://www.youtube.com/watch?v=FWVi4aV36d8">KotlinConf 2023</a> 上推出。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>模型</li>
                <li>网络</li>
                <li>动画</li>
                <li>数据存储</li>
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
                <li>iOS、桌面端和 Web 上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JetBrains/compose-multiplatform/tree/master/examples/chat">聊天 (Chat)</a></strong>
        </td>
        <td>演示如何将 Compose Multiplatform 组件嵌入到 SwiftUI 界面中。用例是联机消息传递。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>模型</li>
                <li>网络</li>
            </list>
        </td>
        <td/>
        <td>
            <list>
                <li>Android 上的 Jetpack Compose</li>
                <li>iOS、桌面端和 Web 上的 Compose Multiplatform</li>
                <li>iOS 上的 SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/kotlin-hands-on/jetcaster-kmp-migration">Jetcaster 跨平台版</a></strong>
        </td>
        <td>将 Compose 示例应用 <a href="https://github.com/android/compose-samples/tree/main/Jetcaster">Jetcaster</a> 跨平台化，在原始 Android 版本的基础上添加了 iOS 和桌面端目标。
            UI 已迁移为使用 Compose Multiplatform，多个库已被替换为其跨平台版本或替代方案。
            迁移原因和过程在 <a href="https://kotlinlang.org/docs/multiplatform/migrate-from-android.html">Jetcaster 迁移教程</a>中进行了说明。
        </td>
        <td>
            <list>
                <li>模型</li>
                <li>网络</li>
                <li>UI</li>
                <li>数据存储</li>
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
                <li>Android、iOS 和桌面端上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/Kotlin/kmm-production-sample">KMM RSS 阅读器</a></strong>
        </td>
        <td>一个用于消费 RSS 订阅源的示例应用程序，旨在展示 Kotlin Multiplatform 如何应用于生产环境。UI 是原生实现的，但有一个实验性分支展示了如何在 iOS 和桌面端使用 Compose Multiplatform。网络使用 <a href="https://ktor.io/docs/create-client.html">Ktor HTTP 客户端</a>完成，而 XML 解析则是原生实现的。使用 Redux 架构共享 UI 状态。
        </td>
        <td>
            <list>
                <li>模型</li>
                <li>网络</li>
                <li>UI 状态</li>
                <li>数据存储</li>
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
                <li>iOS 和桌面端上的 Compose Multiplatform（在实验性分支上）</li>
                <li>iOS 上的 SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/Kotlin/kmm-basic-sample">Kotlin Multiplatform 示例</a></strong>
        </td>
        <td>一个简单的计算器应用程序。展示如何使用 expected 和 actual 声明集成 Kotlin 和原生代码。
        </td>
        <td><p>算法</p></td>
        <td/>
        <td>
            <list>
                <li>Android 上的 Jetpack Compose</li>
                <li>SwiftUI</li>
            </list>
        </td>
</tr>

</table>

### 推荐示例

<table>
    
<tr>
<td>名称</td>
        <td>描述</td>
        <td>共享内容</td>
        <td>值得关注的库</td>
        <td>用户界面</td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/joreilly/Confetti">Confetti</a></strong>
        </td>
        <td>展示了 Kotlin Multiplatform 和 Compose Multiplatform 的许多不同方面。用例是一个用于获取和显示会议日程信息的应用程序。包括对 Wear 和 Auto 平台的支持。使用 GraphQL 进行客户端-服务器通信。其架构在 <a href="https://www.youtube.com/watch?v=uATlWUBSx8Q">KotlinConf 2023</a> 上有深入讨论。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>模型</li>
                <li>网络</li>
                <li>数据存储</li>
                <li>导航</li>
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
                <li>iOS、桌面端和 Web 上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/joreilly/PeopleInSpace">People In Space</a></strong>
        </td>
        <td>展示了 Kotlin Multiplatform 可以运行的许多不同平台。用例是显示当前在太空中的人数以及国际空间站的位置。
        </td>
        <td>
            <list>
                <li>模型</li>
                <li>网络</li>
                <li>数据存储</li>
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
                <li>iOS、桌面端和 Web 上的 Compose Multiplatform</li>
                <li>iOS 和 macOS 上的 SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/touchlab/DroidconKotlin">Sessionize / Droidcon</a></strong>
        </td>
        <td>一个使用 Sessionize API 查看 Droidcon 活动议程的应用程序。可以自定义用于任何在 Sessionize 中存储演讲内容的活动。与 Firebase 集成，因此运行需要 Firebase 帐户。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>模型</li>
                <li>网络</li>
                <li>数据存储</li>
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
        <td>Kotlin Multiplatform 开发的代码和工具集合。旨在展示构建 Kotlin Multiplatform 应用程序时的库、架构选择和最佳做法。用例是下载并显示有关狗品种的信息。在<a href="https://www.youtube.com/watch?v=EJVq_QWaWXE">视频教程</a>中进行了介绍。
        </td>
        <td>
            <list>
                <li>模型</li>
                <li>网络</li>
                <li>ViewModel</li>
                <li>数据存储</li>
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

### 其他社区示例

<table>
    
<tr>
<td>名称</td>
        <td>描述</td>
        <td>共享内容</td>
        <td>值得关注的库</td>
        <td>用户界面</td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/xxfast/NYTimes-KMP">纽约时报 KMP (NYTimes KMP)</a></strong>
        </td>
        <td>纽约时报应用程序的 Compose Multiplatform 版本。允许用户浏览和阅读文章。请注意，要构建和运行该应用程序，您需要一个来自 <a href="https://developer.nytimes.com/">纽约时报的 API 密钥</a>。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>模型</li>
                <li>网络</li>
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
                <li>iOS、桌面端和 Web 上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JoelKanyi/FocusBloom">Focus Bloom</a></strong>
        </td>
        <td>一个生产力和时间管理应用程序。允许用户安排任务并提供其成就反馈。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>模型</li>
                <li>动画</li>
                <li>数据存储</li>
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
                <li>Android、iOS 和桌面端上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/SEAbdulbasit/recipe-app">食谱应用 (Recipe App)</a></strong>
        </td>
        <td>一个用于查看食谱的演示应用程序。展示了动画的使用。</td>
        <td>
            <list>
                <li>UI</li>
                <li>模型</li>
                <li>数据存储</li>
            </list>
        </td>
        <td><p><code>kotlinx-coroutines</code></p></td>
        <td>
            <list>
                <li>Android 上的 Jetpack Compose</li>
                <li>iOS、桌面端和 Web 上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/dbaroncelli/D-KMP-sample">D-KMP-sample</a></strong>
        </td>
        <td><a href="https://danielebaroncelli.medium.com/d-kmp-sample-now-leverages-ios-16-navigation-cebbb81ba2e7">使用 Kotlin MultiPlatform 架构的声明式 UI</a> 的示例应用程序。用例是检索并显示不同国家的疫苗接种统计数据。
        </td>
        <td>
            <list>
                <li>网络</li>
                <li>数据存储</li>
                <li>ViewModel</li>
                <li>导航</li>
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
        <td>一个从 <a href="https://www.themoviedb.org/">The Movie Database</a> 消费数据，以显示当前趋势、即将上映和热门的电影及电视节目的应用程序。需要您在 The Movie Database 创建 API 密钥。
        </td>
        <td>
            <list>
                <li>模型</li>
                <li>网络</li>
                <li>缓存</li>
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
            <strong><a href="https://github.com/msasikanth/twine">Twine - RSS 阅读器</a></strong>
        </td>
        <td>Twine 是一款使用 Kotlin 和 Compose Multiplatform 构建的跨平台 RSS 阅读器应用。它拥有精美的用户界面和体验以浏览订阅源，并支持 Material 3 基于内容的动态主题。
        </td>
        <td>
            <list>
                <li>模型</li>
                <li>网络</li>
                <li>数据存储</li>
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
                <li>Android 和 iOS 上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/razaghimahdi/Shopping-By-KMP">KMP 购物 (Shopping By KMP)</a></strong>
        </td>
        <td>一款使用 Jetpack Compose Multiplatform 构建的跨平台应用程序。Jetpack Compose Multiplatform 是一个声明式框架，用于使用 Kotlin 在多个平台之间共享 UI。该应用程序允许用户在 Android、iOS、Web、桌面端、Android Automotive 和 Android TV 上浏览、搜索和购买购物目录中的产品。
        </td>
        <td>
            <list>
                <li>模型</li>
                <li>网络</li>
                <li>数据存储</li>
                <li>UI</li>
                <li>ViewModel</li>
                <li>动画</li>
                <li>导航</li>
                <li>UI 状态</li>
                <li>用例</li>
                <li>单元测试</li>
                <li>UI 测试</li>
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
                <li>Android、iOS、Web、桌面端、Automotive 和 Android TV 上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/SEAbdulbasit/MusicApp-KMP">音乐应用 KMP (Music App KMP)</a></strong>
        </td>
        <td>一个展示如何在不同平台上与原生 API（如 MediaPlayer）进行交互的应用程序。它使用 Spotify API 获取数据。
        </td>
        <td>
            <list>
                <li>模型</li>
                <li>网络</li>
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
                <li>Android、iOS、桌面端和 Web 上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/fethij/Rijksmuseum">荷兰国立博物馆 (Rijksmuseum)</a></strong>
        </td>
        <td>Rijksmuseum 是一款多模块 Kotlin 和 Compose Multiplatform 应用程序，提供了一种身临其境的方式来探索阿姆斯特丹著名的荷兰国立博物馆的艺术收藏。它利用 Rijksmuseum API 获取并显示各种艺术品的详细信息，包括图像和描述。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>模型</li>
                <li>网络</li>
                <li>导航</li>
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
                <li>Android、iOS、桌面端和 Web 上的 Compose Multiplatform</li>
            </list>
        </td>
</tr>

</table>