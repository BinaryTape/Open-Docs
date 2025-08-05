[//]: # (title: Kotlin Multiplatform 示例)
<show-structure for="none"/>

这是一个精心整理的项目列表，旨在展示 Kotlin Multiplatform 的强大而独特的应用程序。

> 我们目前不接受对此页面的贡献。
> 要让你的项目作为 Kotlin Multiplatform 的示例，请在 GitHub 上使用 [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample) 主题。
> 有关如何将你的项目列入主题，请参见 [GitHub 文档](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics#adding-topics-to-your-repository)。
>
{style="note"}

一些项目使用 Compose Multiplatform 共享几乎所有用户界面代码。其他项目则使用原生代码实现用户界面，例如，仅共享数据模型和算法。要创建全新的 Kotlin Multiplatform 应用程序，我们建议使用 [web wizard](https://kmp.jetbrains.com)。

你可以在 GitHub 上通过 [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample) 主题找到更多示例项目。要探索整个生态系统，请查看 [kotlin-multiplatform](https://github.com/topics/kotlin-multiplatform) 主题。

### JetBrains 官方示例

<table>
    <tr>
        <td>名称</td>
        <td>描述</td>
        <td>共享内容？</td>
        <td>值得关注的库</td>
        <td>用户界面</td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer">Image Viewer</a></strong>
        </td>
        <td>一个用于捕获、查看和存储图片的应用程序。包含对地图的支持。UI 使用 Compose Multiplatform。在 <a href="https://www.youtube.com/watch?v=FWVi4aV36d8">KotlinConf 2023</a> 上推出。
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
                <li>iOS、桌面和 Web 上的 Compose Multiplatform</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/JetBrains/compose-multiplatform/tree/master/examples/chat">Chat</a></strong>
        </td>
        <td>演示如何在 SwiftUI 界面中嵌入 Compose Multiplatform 组件。用例是在线消息。
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
                <li>iOS、桌面和 Web 上的 Compose Multiplatform</li>
                <li>iOS 上的 SwiftUI</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/Kotlin/kmm-production-sample">KMM RSS Reader</a></strong>
        </td>
        <td>一个用于消费 RSS 订阅的示例应用程序，旨在展示 Kotlin Multiplatform 如何在生产环境中使用。UI 是原生实现的，但有一个实验性分支展示了 Compose Multiplatform 如何在 iOS 和桌面端使用。网络使用
            <a href="https://ktor.io/docs/create-client.html">Ktor HTTP 客户端</a> 完成，而 XML 解析是原生实现的。Redux 架构用于共享 UI 状态。
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
                <li>iOS 和桌面上的 Compose Multiplatform（在实验性分支上）</li>
                <li>iOS 上的 SwiftUI</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/Kotlin/kmm-basic-sample">Kotlin Multiplatform Sample</a></strong>
        </td>
        <td>一个简单的计算器应用程序。展示了如何使用预期和实际声明来集成 Kotlin 和原生代码。
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
        <td>共享内容？</td>
        <td>值得关注的库</td>
        <td>用户界面</td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/joreilly/Confetti">Confetti</a></strong>
        </td>
        <td>一个展示 Kotlin Multiplatform 和 Compose Multiplatform 诸多不同方面的项目。用例是一个用于获取和显示会议日程信息的应用程序。包含对 Wear 和 Auto 平台的支持。使用 GraphQL 进行客户端-服务器通信。其架构在 <a href="https://www.youtube.com/watch?v=uATlWUBSx8Q">KotlinConf 2023</a> 上进行了深入讨论。
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
                <li>iOS、桌面和 Web 上的 Compose Multiplatform</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/joreilly/PeopleInSpace">People In Space</a></strong>
        </td>
        <td>一个展示 Kotlin Multiplatform 可以运行的诸多不同平台的项目。用例是显示当前在太空中的人数以及国际空间站的位置。
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
                <li>iOS、桌面和 Web 上的 Compose Multiplatform</li>
                <li>iOS 和 macOS 上的 SwiftUI</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/touchlab/DroidconKotlin">Sessionize / Droidcon</a></strong>
        </td>
        <td>一个用于使用 Sessionize API 查看 Droidcon 事件议程的应用程序。可以定制以与任何将演讲存储在 Sessionize 中的事件配合使用。它与 Firebase 集成，因此需要一个 Firebase 账户才能运行。
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
        <td>一个用于 Kotlin Multiplatform 开发的代码和工具集合。旨在展示构建 Kotlin Multiplatform 应用程序时的库、架构选择和最佳实践。用例是下载和显示狗品种信息。在此<a href="https://www.youtube.com/watch?v=EJVq_QWaWXE">视频教程</a>中介绍。
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
        <td>共享内容？</td>
        <td>值得关注的库</td>
        <td>用户界面</td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/xxfast/NYTimes-KMP">NYTimes KMP</a></strong>
        </td>
        <td>一个基于 Compose Multiplatform 的纽约时报应用程序版本。允许用户浏览和阅读文章。请注意，要构建和运行此应用程序，你需要一个来自 <a href="https://developer.nytimes.com/">纽约时报的 API 密钥</a>。
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
                <li>iOS、桌面和 Web 上的 Compose Multiplatform</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/JoelKanyi/FocusBloom">Focus Bloom</a></strong>
        </td>
        <td>一个生产力与时间管理应用程序。允许用户安排任务，并就他们的成就提供反馈。
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
                <li>Android、iOS 和桌面上的 Compose Multiplatform</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/SEAbdulbasit/recipe-app">Recipe App</a></strong>
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
                <li>iOS、桌面和 Web 上的 Compose Multiplatform</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/dbaroncelli/D-KMP-sample">D-KMP-sample</a></strong>
        </td>
        <td>一个用于 <a href="https://danielebaroncelli.medium.com/d-kmp-sample-now-leverages-ios-16-navigation-cebbb81ba2e7">使用 Kotlin MultiPlatform 架构构建声明式 UI</a> 的示例应用程序。用例是检索和显示不同国家的疫苗接种统计数据。
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
        <td>一个从 <a href="https://www.themoviedb.org/">The Movie Database</a> 消费数据以显示当前热门、即将上映和流行电影及电视节目的应用程序。需要你创建一个 The Movie Database 的 API 密钥。
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
            <strong><a href="https://github.com/msasikanth/twine">Twine - RSS Reader</a></strong>
        </td>
        <td>Twine 是一个使用 Kotlin 和 Compose Multiplatform 构建的多平台 RSS 阅读器应用。它具有良好的用户界面和体验，可以浏览订阅源，并支持基于 Material 3 内容的动态主题。
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
            <strong><a href="https://github.com/razaghimahdi/Shopping-By-KMP">Shopping By KMP</a></strong>
        </td>
        <td>一个使用 Jetpack Compose Multiplatform 构建的跨平台应用程序，Jetpack Compose Multiplatform 是一个用于使用 Kotlin 在多个平台间共享 UI 的声明式框架。该应用程序允许用户在 Android、iOS、Web、桌面、Android Automotive 和 Android TV 上浏览、搜索和购买购物目录中的产品。
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
                <li>Android、iOS、Web、桌面、车载和 Android TV 上的 Compose Multiplatform</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/SEAbdulbasit/MusicApp-KMP">Music App KMP</a></strong>
        </td>
        <td>一个应用程序，展示如何在不同平台上与 MediaPlayer 等原生 API 交互。它使用 Spotify API 获取数据。
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
                <li>Android、iOS、桌面和 Web 上的 Compose Multiplatform</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/fethij/Rijksmuseum">Rijksmuseum</a></strong>
        </td>
        <td>Rijksmuseum 是一个多模块的 Kotlin 和 Compose Multiplatform 应用，提供沉浸式方式来探索位于阿姆斯特丹的著名国立博物馆的艺术收藏。它利用 Rijksmuseum API 获取并显示各种艺术品的详细信息，包括图片和描述。
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
                <li>Android、iOS、桌面和 Web 上的 Compose Multiplatform</li>
            </list>
        </td>
    </tr>
</table>