[//]: # (title: Kotlin Multiplatform サンプル)
<show-structure for="none"/>

これは、Kotlin Multiplatform の堅牢でユニークなアプリケーションを紹介することを目的とした、厳選されたプロジェクトのリストです。

> 現在、このページへの直接の貢献（コントリビューション）は受け付けておりません。
> あなたのプロジェクトを Kotlin Multiplatform のサンプルとして掲載するには、GitHub で [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample) トピックを使用してください。
> トピックを使用してプロジェクトを掲載する方法については、[GitHub ドキュメント](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics#adding-topics-to-your-repository)を参照してください。
>
{style="note"}

プロジェクトの中には、ユーザーインターフェースに Compose Multiplatform を使用して、ほぼすべてのコードを共有しているものもあれば、ユーザーインターフェースにはネイティブコードを使用し、データモデルやアルゴリズムのみを共有しているものもあります。独自の新しい Kotlin Multiplatform アプリケーションを作成するには、[ウェブウィザード](https://kmp.jetbrains.com)（Web wizard）の使用をお勧めします。

GitHub の [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample) トピックを通じて、さらに多くのサンプルプロジェクトを見つけることができます。エコシステム全体を探索するには、[kotlin-multiplatform](https://github.com/topics/kotlin-multiplatform) トピックを確認してください。

### JetBrains 公式サンプル

<table>
    
<tr>
<td>名前</td>
        <td>説明</td>
        <td>共有されているもの</td>
        <td>注目のライブラリ</td>
        <td>ユーザーインターフェース</td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JetBrains/kotlinconf-app">公式 KotlinConf アプリケーション</a></strong>
        </td>
        <td><a href="https://kotlinconf.com/">KotlinConf</a> のコンパニオンアプリケーションです。
            Android、iOS、デスクトップ、および Web 用のクライアントアプリケーションは、Compose Multiplatform を使用した共有 UI で構築されています。
            バックエンドアプリケーションは、<a href="https://ktor.io/">Ktor</a> サーバーサイドフレームワークと <a href="https://www.jetbrains.com/help/exposed/home.html">Exposed</a> データベースライブラリを採用しています。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>モデル</li>
                <li>ネットワーク</li>
                <li>データストレージ</li>
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
                <li>Android: Jetpack Compose</li>
                <li>iOS、デスクトップ、Web: Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer">Image Viewer</a></strong>
        </td>
        <td>写真の撮影、閲覧、保存を行うためのアプリケーションです。マップのサポートを含みます。UI には Compose Multiplatform を使用しています。<a href="https://www.youtube.com/watch?v=FWVi4aV36d8">KotlinConf 2023</a> で紹介されました。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>モデル</li>
                <li>ネットワーク</li>
                <li>アニメーション</li>
                <li>データストレージ</li>
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
                <li>Android: Jetpack Compose</li>
                <li>iOS、デスクトップ、Web: Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JetBrains/compose-multiplatform/tree/master/examples/chat">Chat</a></strong>
        </td>
        <td>SwiftUI インフェース内に Compose Multiplatform コンポーネントを埋め込む方法のデモンストレーションです。ユースケースはオンラインメッセージングです。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>モデル</li>
                <li>ネットワーク</li>
            </list>
        </td>
        <td/>
        <td>
            <list>
                <li>Android: Jetpack Compose</li>
                <li>iOS、デスクトップ、Web: Compose Multiplatform</li>
                <li>iOS: SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/kotlin-hands-on/jetcaster-kmp-migration">Jetcaster Multiplatform</a></strong>
        </td>
        <td>Compose サンプルの <a href="https://github.com/android/compose-samples/tree/main/Jetcaster">Jetcaster</a> アプリをマルチプラットフォーム化したもので、オリジナルの Android 版に iOS とデスクトップのターゲットが追加されています。
            UI は Compose Multiplatform を使用するように移行され、いくつかのライブラリはマルチプラットフォーム版または代替品に置き換えられています。
            移行の理由とプロセスについては、<a href="https://kotlinlang.org/docs/multiplatform/migrate-from-android.html">Jetcaster 移行チュートリアル</a>で詳しく説明されています。
        </td>
        <td>
            <list>
                <li>モデル</li>
                <li>ネットワーク</li>
                <li>UI</li>
                <li>データストレージ</li>
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
                <li>Android、iOS、デスクトップ: Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/Kotlin/kmm-production-sample">KMM RSS Reader</a></strong>
        </td>
        <td>Kotlin Multiplatform を本番環境でどのように使用できるかを示すために設計された、RSS フィード購読用のサンプルアプリケーションです。UI はネイティブで実装されていますが、iOS とデスクトップで Compose Multiplatform をどのように使用できるかを示す実験的なブランチもあります。ネットワークには <a href="https://ktor.io/docs/create-client.html">Ktor HTTP Client</a> を使用し、XML パースはネイティブで実装されています。UI 状態の共有には Redux アーキテクチャが使用されています。
        </td>
        <td>
            <list>
                <li>モデル</li>
                <li>ネットワーク</li>
                <li>UI 状態</li>
                <li>データストレージ</li>
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
                <li>Android: Jetpack Compose</li>
                <li>iOS およびデスクトップ: Compose Multiplatform（実験的ブランチ）</li>
                <li>iOS: SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/Kotlin/kmm-basic-sample">Kotlin Multiplatform Sample</a></strong>
        </td>
        <td>シンプルな電卓アプリケーションです。expected および actual 宣言を使用して Kotlin とネイティブコードを統合する方法を示しています。
        </td>
        <td><p>アルゴリズム</p></td>
        <td/>
        <td>
            <list>
                <li>Android: Jetpack Compose</li>
                <li>iOS: SwiftUI</li>
            </list>
        </td>
</tr>

</table>

### 推奨サンプル

<table>
    
<tr>
<td>名前</td>
        <td>説明</td>
        <td>共有されているもの</td>
        <td>注目のライブラリ</td>
        <td>ユーザーインターフェース</td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/joreilly/Confetti">Confetti</a></strong>
        </td>
        <td>Kotlin Multiplatform と Compose Multiplatform の多くの異なる側面を紹介するショーケースです。ユースケースは、カンファレンスのスケジュール情報を取得して表示するアプリケーションです。Wear および Auto プラットフォームのサポートが含まれています。クライアント・サーバー間通信には GraphQL を使用しています。アーキテクチャについては、<a href="https://www.youtube.com/watch?v=uATlWUBSx8Q">KotlinConf 2023</a> で詳しく議論されています。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>モデル</li>
                <li>ネットワーク</li>
                <li>データストレージ</li>
                <li>ナビゲーション</li>
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
                <li>Android、Auto、Wear: Jetpack Compose</li>
                <li>iOS、デスクトップ、Web: Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/joreilly/PeopleInSpace">People In Space</a></strong>
        </td>
        <td>Kotlin Multiplatform が動作できる多くの異なるプラットフォームのショーケースです。ユースケースは、現在宇宙にいる人数と国際宇宙ステーション（ISS）の位置を表示することです。
        </td>
        <td>
            <list>
                <li>モデル</li>
                <li>ネットワーク</li>
                <li>データストレージ</li>
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
                <li>Android、Wear OS: Jetpack Compose</li>
                <li>iOS、デスクトップ、Web: Compose Multiplatform</li>
                <li>iOS、macOS: SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/touchlab/DroidconKotlin">Sessionize / Droidcon</a></strong>
        </td>
        <td>Sessionize API を使用して Droidcon イベントのアジェンダを表示するためのアプリケーションです。Sessionize にセッション情報を保存しているあらゆるイベントに合わせてカスタマイズ可能です。Firebase と統合されており、実行には Firebase アカウントが必要です。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>モデル</li>
                <li>ネットワーク</li>
                <li>データストレージ</li>
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
                <li>Android: Jetpack Compose</li>
                <li>iOS: Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/touchlab/KaMPKit">KaMPKit</a></strong>
        </td>
        <td>Kotlin Multiplatform 開発のためのコードとツールのコレクションです。Kotlin Multiplatform アプリケーションを構築する際のライブラリ、アーキテクチャの選択、およびベストプラクティスを紹介するように設計されています。ユースケースは、犬の品種に関する情報のダウンロードと表示です。この<a href="https://www.youtube.com/watch?v=EJVq_QWaWXE">ビデオチュートリアル</a>で紹介されました。
        </td>
        <td>
            <list>
                <li>モデル</li>
                <li>ネットワーク</li>
                <li>ViewModel</li>
                <li>データストレージ</li>
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
                <li>Android: Jetpack Compose</li>
                <li>iOS: SwiftUI</li>
            </list>
        </td>
</tr>

</table>

### その他のコミュニティサンプル

<table>
    
<tr>
<td>名前</td>
        <td>説明</td>
        <td>共有されているもの</td>
        <td>注目のライブラリ</td>
        <td>ユーザーインターフェース</td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/xxfast/NYTimes-KMP">NYTimes KMP</a></strong>
        </td>
        <td>ニューヨーク・タイムズ（New York Times）アプリケーションの Compose Multiplatform ベースのバージョンです。ユーザーが記事を閲覧して読むことができます。アプリケーションのビルドと実行には、<a href="https://developer.nytimes.com/">ニューヨーク・タイムズの API キー</a>が必要であることに注意してください。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>モデル</li>
                <li>ネットワーク</li>
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
                <li>Android、Wear: Jetpack Compose</li>
                <li>iOS、デスクトップ、Web: Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JoelKanyi/FocusBloom">Focus Bloom</a></strong>
        </td>
        <td>生産性と時間管理のためのアプリケーションです。ユーザーがタスクをスケジュールし、その達成状況に関するフィードバックを提供できるようにします。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>モデル</li>
                <li>アニメーション</li>
                <li>データストレージ</li>
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
                <li>Android、iOS、デスクトップ: Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/SEAbdulbasit/recipe-app">Recipe App</a></strong>
        </td>
        <td>レシピを閲覧するためのデモンストレーションアプリケーションです。アニメーションの使用例を示しています。</td>
        <td>
            <list>
                <li>UI</li>
                <li>モデル</li>
                <li>データストレージ</li>
            </list>
        </td>
        <td><p><code>kotlinx-coroutines</code></p></td>
        <td>
            <list>
                <li>Android: Jetpack Compose</li>
                <li>iOS、デスクトップ、Web: Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/dbaroncelli/D-KMP-sample">D-KMP-sample</a></strong>
        </td>
        <td><a href="https://danielebaroncelli.medium.com/d-kmp-sample-now-leverages-ios-16-navigation-cebbb81ba2e7">
            Kotlin MultiPlatform アーキテクチャによる宣言型 UI</a> のサンプルアプリケーションです。ユースケースは、各国のワクチン接種統計の取得と表示です。
        </td>
        <td>
            <list>
                <li>ネットワーク</li>
                <li>データストレージ</li>
                <li>ViewModel</li>
                <li>ナビゲーション</li>
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
                <li>Android: Jetpack Compose</li>
                <li>iOS: SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/VictorKabata/Notflix">Notflix</a></strong>
        </td>
        <td><a href="https://www.themoviedb.org/">The Movie Database</a> からデータを取得し、現在のトレンド、近日公開、および人気の映画やテレビ番組を表示するアプリケーションです。The Movie Database で API キーを作成する必要があります。
        </td>
        <td>
            <list>
                <li>モデル</li>
                <li>ネットワーク</li>
                <li>キャッシング</li>
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
                <li>Android: Jetpack Compose</li>
                <li>iOS: SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/msasikanth/twine">Twine - RSS Reader</a></strong>
        </td>
        <td>Twine は、Kotlin と Compose Multiplatform を使用して構築されたマルチプラットフォーム RSS リーダーアプリです。優れたユーザーインターフェースとユーザーエクスペリエンスを備え、フィードを閲覧でき、Material 3 のコンテンツベースのダイナミックテーマをサポートしています。
        </td>
        <td>
            <list>
                <li>モデル</li>
                <li>ネットワーク</li>
                <li>データストレージ</li>
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
                <li>Android、iOS: Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/razaghimahdi/Shopping-By-KMP">Shopping By KMP</a></strong>
        </td>
        <td>Jetpack Compose Multiplatform（Kotlin で複数のプラットフォーム間で UI を共有するための宣言型フレームワーク）を使用して構築されたクロスプラットフォームアプリケーションです。Android、iOS、Web、デスクトップ、Android Automotive、および Android TV で、ショッピングカタログから製品の閲覧、検索、購入を行うことができます。
        </td>
        <td>
            <list>
                <li>モデル</li>
                <li>ネットワーク</li>
                <li>データストレージ</li>
                <li>UI</li>
                <li>ViewModel</li>
                <li>アニメーション</li>
                <li>ナビゲーション</li>
                <li>UI 状態</li>
                <li>ユースケース</li>
                <li>ユニットテスト</li>
                <li>UI テスト</li>
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
                <li>Android、iOS、Web、デスクトップ、Automotive、Android TV: Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/SEAbdulbasit/MusicApp-KMP">Music App KMP</a></strong>
        </td>
        <td>異なるプラットフォームで MediaPlayer のようなネイティブ API とやり取りする方法を示すアプリケーションです。データの取得には Spotify API を使用しています。
        </td>
        <td>
            <list>
                <li>モデル</li>
                <li>ネットワーク</li>
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
                <li>Android、iOS、デスクトップ、Web: Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/fethij/Rijksmuseum">Rijksmuseum</a></strong>
        </td>
        <td>Rijksmuseum は、アムステルダムの有名なアムステルダム国立美術館（Rijksmuseum）の美術コレクションを探索するための、没入感のあるマルチモジュール化された Kotlin および Compose Multiplatform アプリです。Rijksmuseum API を利用して、画像や説明を含む様々な美術品に関する詳細情報を取得し、表示します。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>モデル</li>
                <li>ネットワーク</li>
                <li>ナビゲーション</li>
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
                <li>Android、iOS、デスクトップ、Web: Compose Multiplatform</li>
            </list>
        </td>
</tr>

</table>