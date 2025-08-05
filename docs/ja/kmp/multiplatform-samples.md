[//]: # (title: Kotlin Multiplatform サンプル)
<show-structure for="none"/>

これは、Kotlin Multiplatformの堅牢でユニークなアプリケーションを示すことを目的とした、厳選されたプロジェクトのリストです。

> 現在、このページへの貢献は受け付けておりません。
> Kotlin Multiplatformのサンプルとしてプロジェクトを紹介するには、GitHubの[kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample)トピックを使用してください。
> プロジェクトをトピックで紹介する方法については、[GitHubドキュメント](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics#adding-topics-to-your-repository)を参照してください。
>
{style="note"}

一部のプロジェクトでは、ユーザーインターフェースにCompose Multiplatformを使用して、コードのほとんどすべてを共有しています。
その他のプロジェクトでは、ユーザーインターフェースにネイティブコードを使用し、例えばデータモデルやアルゴリズムのみを共有しています。
独自の新しいKotlin Multiplatformアプリケーションを作成するには、[Webウィザード](https://kmp.jetbrains.com)を使用することをお勧めします。

さらに多くのサンプルプロジェクトは、GitHubで[kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample)トピックを介して見つけることができます。
エコシステム全体を探索するには、[kotlin-multiplatform](https://github.com/topics/kotlin-multiplatform)トピックを確認してください。

### JetBrains公式サンプル

<table>
    <tr>
        <td>名前</td>
        <td>説明</td>
        <td>共有されるもの</td>
        <td>注目すべきライブラリ</td>
        <td>ユーザーインターフェース</td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer">Image Viewer</a></strong>
        </td>
        <td>写真の撮影、表示、保存を行うアプリケーションです。マップのサポートを含みます。UIにはCompose
            Multiplatformを使用しています。<a href="https://www.youtube.com/watch?v=FWVi4aV36d8">KotlinConf 2023</a>で発表されました。
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
                <li>Android上のJetpack Compose</li>
                <li>iOS、デスクトップ、ウェブ上のCompose Multiplatform</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/JetBrains/compose-multiplatform/tree/master/examples/chat">Chat</a></strong>
        </td>
        <td>SwiftUIインターフェース内にCompose Multiplatformコンポーネントを埋め込む方法のデモンストレーションです。ユースケースはオンラインメッセージングです。
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
                <li>Android上のJetpack Compose</li>
                <li>iOS、デスクトップ、ウェブ上のCompose Multiplatform</li>
                <li>iOS上のSwiftUI</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/Kotlin/kmm-production-sample">KMM RSS Reader</a></strong>
        </td>
        <td>Kotlin Multiplatformが本番環境でどのように使用できるかを示すために設計された、RSSフィードを消費するためのサンプルアプリケーションです。UIはネイティブで実装されていますが、Compose
            MultiplatformがiOSおよびデスクトップでどのように使用できるかを示す実験的なブランチがあります。ネットワークは
            <a href="https://ktor.io/docs/create-client.html">Ktor HTTP Client</a>を使用して行われ、XMLパースは
            ネイティブで実装されています。UIの状態共有にはReduxアーキテクチャが使用されています。
        </td>
        <td>
            <list>
                <li>モデル</li>
                <li>ネットワーク</li>
                <li>UI状態</li>
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
                <li>Android上のJetpack Compose</li>
                <li>iOSおよびデスクトップ上のCompose Multiplatform（実験的ブランチにて）</li>
                <li>iOS上のSwiftUI</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/Kotlin/kmm-basic-sample">Kotlin Multiplatform Sample</a></strong>
        </td>
        <td>シンプルな電卓アプリケーションです。expect/actual宣言を使用してKotlinコードとネイティブコードを統合する方法を示しています。
        </td>
        <td><p>アルゴリズム</p></td>
        <td/>
        <td>
            <list>
                <li>Android上のJetpack Compose</li>
                <li>SwiftUI</li>
            </list>
        </td>
    </tr>
</table>

### おすすめのサンプル

<table>
    <tr>
        <td>名前</td>
        <td>説明</td>
        <td>共有されるもの</td>
        <td>注目すべきライブラリ</td>
        <td>ユーザーインターフェース</td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/joreilly/Confetti">Confetti</a></strong>
        </td>
        <td>Kotlin MultiplatformとCompose Multiplatformのさまざまな側面を示すショーケースです。ユースケースは、会議のスケジュールに関する情報を取得および表示するアプリケーションです。WearおよびAutoプラットフォームのサポートを含みます。クライアントサーバー通信にはGraphQLを使用しています。アーキテクチャについては、<a href="https://www.youtube.com/watch?v=uATlWUBSx8Q">KotlinConf 2023</a>で詳細に議論されています。
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
                <li>Android、Auto、Wear上のJetpack Compose</li>
                <li>iOS、デスクトップ、ウェブ上のCompose Multiplatform</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/joreilly/PeopleInSpace">People In Space</a></strong>
        </td>
        <td>Kotlin Multiplatformが動作するさまざまなプラットフォームを示すショーケースです。ユースケースは、現在宇宙にいる人数と国際宇宙ステーションの位置を表示することです。
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
                <li>AndroidおよびWear OS上のJetpack Compose</li>
                <li>iOS、デスクトップ、ウェブ上のCompose Multiplatform</li>
                <li>iOSおよびmacOS上のSwiftUI</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/touchlab/DroidconKotlin">Sessionize / Droidcon</a></strong>
        </td>
        <td>Sessionize APIを使用してDroidconイベントの議題を表示するアプリケーションです。Sessionizeに講演を保存するあらゆるイベントで使用できるようにカスタマイズ可能です。Firebaseと統合されているため、実行にはFirebaseアカウントが必要です。
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
                <li>Android上のJetpack Compose</li>
                <li>iOS上のCompose Multiplatform</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/touchlab/KaMPKit">KaMPKit</a></strong>
        </td>
        <td>Kotlin Multiplatform開発のためのコードとツールのコレクションです。Kotlin Multiplatformアプリケーションを構築する際のライブラリ、アーキテクチャの選択、ベストプラクティスを示すように設計されています。ユースケースは、犬の品種に関する情報をダウンロードして表示することです。<a href="https://www.youtube.com/watch?v=EJVq_QWaWXE">このビデオチュートリアル</a>で紹介されています。
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
                <li>Android上のJetpack Compose</li>
                <li>iOS上のSwiftUI</li>
            </list>
        </td>
    </tr>
</table>

### その他のコミュニティサンプル

<table>
    <tr>
        <td>名前</td>
        <td>説明</td>
        <td>共有されるもの</td>
        <td>注目すべきライブラリ</td>
        <td>ユーザーインターフェース</td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/xxfast/NYTimes-KMP">NYTimes KMP</a></strong>
        </td>
        <td>ニューヨーク・タイムズアプリケーションのCompose Multiplatformベースのバージョンです。ユーザーは記事を閲覧、読解できます。アプリケーションをビルドして実行するには、<a href="https://developer.nytimes.com/">ニューヨーク・タイムズのAPIキー</a>が必要であることに注意してください。
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
                <li>AndroidおよびWear上のJetpack Compose</li>
                <li>iOS、デスクトップ、ウェブ上のCompose Multiplatform</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/JoelKanyi/FocusBloom">Focus Bloom</a></strong>
        </td>
        <td>生産性向上と時間管理のアプリケーションです。ユーザーはタスクをスケジュールし、達成度に関するフィードバックを受け取ることができます。
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
                <li>Android、iOS、デスクトップ上のCompose Multiplatform</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/SEAbdulbasit/recipe-app">Recipe App</a></strong>
        </td>
        <td>レシピを閲覧するためのデモンストレーションアプリケーションです。アニメーションの使用例を示します。</td>
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
                <li>Android上のJetpack Compose</li>
                <li>iOS、デスクトップ、ウェブ上のCompose Multiplatform</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/dbaroncelli/D-KMP-sample">D-KMP-sample</a></strong>
        </td>
        <td><a href="https://danielebaroncelli.medium.com/d-kmp-sample-now-leverages-ios-16-navigation-cebbb81ba2e7">Declarative UIs with Kotlin MultiPlatformアーキテクチャ</a>のサンプルアプリケーションです。ユースケースは、さまざまな国のワクチン接種統計を取得して表示することです。
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
                <li>Android上のJetpack Compose</li>
                <li>iOS上のSwiftUI</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/VictorKabata/Notflix">Notflix</a></strong>
        </td>
        <td><a href="https://www.themoviedb.org/">The Movie Database</a>からデータを消費し、現在のトレンド、今後の公開、人気のある映画やテレビ番組を表示するアプリケーションです。The Movie DatabaseでAPIキーを作成する必要があります。
        </td>
        <td>
            <list>
                <li>モデル</li>
                <li>ネットワーク</li>
                <li>キャッシュ</li>
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
                <li>Android上のJetpack Compose</li>
                <li>iOS上のSwiftUI</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/msasikanth/twine">Twine - RSS Reader</a></strong>
        </td>
        <td>Twineは、KotlinとCompose Multiplatformを使用して構築されたマルチプラットフォームRSSリーダーアプリです。フィードを閲覧するための優れたユーザーインターフェースとエクスペリエンスを備え、Material 3のコンテンツベースの動的テーマ設定をサポートしています。
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
                <li>AndroidおよびiOS上のCompose Multiplatform</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/razaghimahdi/Shopping-By-KMP">Shopping By KMP</a></strong>
        </td>
        <td>Kotlinを使用して複数のプラットフォームでUIを共有するための宣言型フレームワークであるJetpack Compose Multiplatformで構築されたクロスプラットフォームアプリケーションです。このアプリケーションは、ユーザーがAndroid、iOS、ウェブ、デスクトップ、Android Automotive、Android TV上のショッピングカタログから製品を閲覧、検索、購入できるようにします。
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
                <li>UI状態</li>
                <li>ユースケース</li>
                <li>ユニットテスト</li>
                <li>UIテスト</li>
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
                <li>Android、iOS、ウェブ、デスクトップ、automotive、Android TV上のCompose Multiplatform</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/SEAbdulbasit/MusicApp-KMP">Music App KMP</a></strong>
        </td>
        <td>異なるプラットフォームでMediaPlayerのようなネイティブAPIとどのように連携するかを示すアプリケーションです。データ取得にはSpotify APIを使用しています。
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
                <li>Android、iOS、デスクトップ、ウェブ上のCompose Multiplatform</li>
            </list>
        </td>
    </tr>
    <tr>
        <td>
            <strong><a href="https://github.com/fethij/Rijksmuseum">Rijksmuseum</a></strong>
        </td>
        <td>Rijksmuseumは、オランダのアムステルダムにある有名なアムステルダム国立美術館（Rijksmuseum）の美術コレクションを没入型で探索できる、マルチモジュールなKotlinおよびCompose Multiplatformアプリです。Rijksmuseum APIを利用して、画像や説明を含むさまざまな芸術作品に関する詳細情報を取得し、表示します。
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
                <li>Android、iOS、デスクトップ、ウェブ上のCompose Multiplatform</li>
            </list>
        </td>
    </tr>
</table>