[//]: # (title: Kotlin Multiplatform のサンプル)
<show-structure for="none"/>

Kotlin Multiplatform の堅牢かつユニークな活用方法を示すことを目的とした、厳選されたプロジェクトのリストです。

> 現在、このページへの貢献は受け付けておりません。
> ご自身のプロジェクトを Kotlin Multiplatform のサンプルとして紹介したい場合は、GitHub で [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample) トピックを使用してください。
> プロジェクトをトピックで紹介する方法については、[GitHub ドキュメント](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics#adding-topics-to-your-repository)を参照してください。
>
{style="note"}

一部のプロジェクトでは、ユーザーインターフェースに Compose Multiplatform を使用して、ほとんどのコードを共有しています。
その他では、ユーザーインターフェースにネイティブコードを使用し、例えばデータモデルとアルゴリズムのみを共有しています。
新しい Kotlin Multiplatform アプリケーションを作成するには、[ウェブウィザード](https://kmp.jetbrains.com)を使用することをお勧めします。

GitHub では、[kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample) トピックを使用して、さらに多くのサンプルプロジェクトを見つけることができます。
エコシステム全体を探索するには、[kotlin-multiplatform](https://github.com/topics/kotlin-multiplatform) トピックを確認してください。

### JetBrains 公式サンプル

<table>
    
<tr>
<td>名前</td>
        <td>説明</td>
        <td>共有されているもの</td>
        <td>主なライブラリ</td>
        <td>ユーザーインターフェース</td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer">Image Viewer</a></strong>
        </td>
        <td>画像のキャプチャ、表示、保存を行うアプリケーションです。マップのサポートを含みます。UI に Compose Multiplatform を使用しています。<a href="https://www.youtube.com/watch?v=FWVi4aV36d8">KotlinConf 2023</a> で紹介されました。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>モデル</li>
                <li>ネットワーキング</li>
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
                <li>Android 上の Jetpack Compose</li>
                <li>iOS、デスクトップ、ウェブ上の Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JetBrains/compose-multiplatform/tree/master/examples/chat">Chat</a></strong>
        </td>
        <td>Compose Multiplatform コンポーネントを SwiftUI インターフェース内に埋め込む方法を示すデモンストレーションです。ユースケースはオンラインメッセージングです。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>モデル</li>
                <li>ネットワーキング</li>
            </list>
        </td>
        <td/>
        <td>
            <list>
                <li>Android 上の Jetpack Compose</li>
                <li>iOS、デスクトップ、ウェブ上の Compose Multiplatform</li>
                <li>iOS 上の SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/Kotlin/kmm-production-sample">KMM RSS Reader</a></strong>
        </td>
        <td>Kotlin Multiplatform をプロダクションでどのように使用できるかを示すために設計された、RSS フィードを消費するサンプルアプリケーションです。UI はネイティブで実装されていますが、Compose Multiplatform を iOS およびデスクトップで使用できる実験的なブランチがあります。ネットワーキングは <a href="https://ktor.io/docs/create-client.html">Ktor HTTP クライアント</a>を使用して行われ、XML パースはネイティブで実装されています。UI ステートの共有には Redux アーキテクチャが使用されています。
        </td>
        <td>
            <list>
                <li>モデル</li>
                <li>ネットワーキング</li>
                <li>UI ステート</li>
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
                <li>Android 上の Jetpack Compose</li>
                <li>iOS およびデスクトップ上の Compose Multiplatform (実験的なブランチで)</li>
                <li>iOS 上の SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/Kotlin/kmm-basic-sample">Kotlin Multiplatform Sample</a></strong>
        </td>
        <td>シンプルな計算機アプリケーションです。expected および actual 宣言を使用して Kotlin とネイティブコードを統合する方法を示します。
        </td>
        <td><p>アルゴリズム</p></td>
        <td/>
        <td>
            <list>
                <li>Android 上の Jetpack Compose</li>
                <li>SwiftUI</li>
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
        <td>主なライブラリ</td>
        <td>ユーザーインターフェース</td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/joreilly/Confetti">Confetti</a></strong>
        </td>
        <td>Kotlin Multiplatform と Compose Multiplatform の様々な側面を示すショーケースです。ユースケースは、会議のスケジュールに関する情報を取得および表示するアプリケーションです。Wear および Auto プラットフォームのサポートを含みます。クライアント-サーバー通信には GraphQL を使用しています。アーキテクチャについては、<a href="https://www.youtube.com/watch?v=uATlWUBSx8Q">KotlinConf 2023</a> で詳しく議論されました。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>モデル</li>
                <li>ネットワーキング</li>
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
                <li>Android、Auto、Wear 上の Jetpack Compose</li>
                <li>iOS、デスクトップ、ウェブ上の Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/joreilly/PeopleInSpace">People In Space</a></strong>
        </td>
        <td>Kotlin Multiplatform が実行できる多くの異なるプラットフォームのショーケースです。ユースケースは、現在宇宙にいる人数と国際宇宙ステーションの位置を表示することです。
        </td>
        <td>
            <list>
                <li>モデル</li>
                <li>ネットワーキング</li>
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
                <li>Android および Wear OS 上の Jetpack Compose</li>
                <li>iOS、デスクトップ、ウェブ上の Compose Multiplatform</li>
                <li>iOS および macOS 上の SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/touchlab/DroidconKotlin">Sessionize / Droidcon</a></strong>
        </td>
        <td>Sessionize API を使用して Droidcon イベントの議題を表示するアプリケーションです。Sessionize にトークを保存する任意のイベントに合わせてカスタマイズできます。Firebase と統合されており、実行には Firebase アカウントが必要です。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>モデル</li>
                <li>ネットワーキング</li>
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
                <li>Android 上の Jetpack Compose</li>
                <li>iOS 上の Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/touchlab/KaMPKit">KaMPKit</a></strong>
        </td>
        <td>Kotlin Multiplatform 開発のためのコードとツールのコレクションです。Kotlin Multiplatform アプリケーションを構築する際のライブラリ、アーキテクチャの選択、ベストプラクティスを紹介するために設計されています。ユースケースは、犬の品種に関する情報をダウンロードして表示することです。<a href="https://www.youtube.com/watch?v=EJVq_QWaWXE">このビデオチュートリアル</a>で紹介されました。
        </td>
        <td>
            <list>
                <li>モデル</li>
                <li>ネットワーキング</li>
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
                <li>Android 上の Jetpack Compose</li>
                <li>iOS 上の SwiftUI</li>
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
        <td>主なライブラリ</td>
        <td>ユーザーインターフェース</td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/xxfast/NYTimes-KMP">NYTimes KMP</a></strong>
        </td>
        <td>New York Times アプリケーションの Compose Multiplatform ベースのバージョンです。ユーザーが記事を閲覧・購読できます。アプリケーションをビルドして実行するには、<a href="https://developer.nytimes.com/">New York Times からの API キー</a>が必要であることに注意してください。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>モデル</li>
                <li>ネットワーキング</li>
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
                <li>Android および Wear 上の Jetpack Compose</li>
                <li>iOS、デスクトップ、ウェブ上の Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/JoelKanyi/FocusBloom">Focus Bloom</a></strong>
        </td>
        <td>生産性および時間管理アプリケーションです。ユーザーがタスクをスケジュールし、達成度に関するフィードバックを提供できます。
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
                <li>Android、iOS、デスクトップ上の Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/SEAbdulbasit/recipe-app">Recipe App</a></strong>
        </td>
        <td>レシピを表示するためのデモンストレーションアプリケーションです。アニメーションの使用法を紹介します。</td>
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
                <li>Android 上の Jetpack Compose</li>
                <li>iOS、デスクトップ、ウェブ上の Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/dbaroncelli/D-KMP-sample">D-KMP-sample</a></strong>
        </td>
        <td><a href="https://danielebaroncelli.medium.com/d-kmp-sample-now-leverages-ios-16-navigation-cebbb81ba2e7">Declarative UIs with Kotlin MultiPlatform architecture</a> のサンプルアプリケーションです。ユースケースは、異なる国のワクチン接種統計を取得・表示することです。
        </td>
        <td>
            <list>
                <li>ネットワーキング</li>
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
                <li>Android 上の Jetpack Compose</li>
                <li>iOS 上の SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/VictorKabata/Notflix">Notflix</a></strong>
        </td>
        <td><a href="https://www.themoviedb.org/">The Movie Database</a> からデータを取得し、現在のトレンド、今後公開される、人気の映画やテレビ番組を表示するアプリケーションです。The Movie Database で API キーを作成する必要があります。
        </td>
        <td>
            <list>
                <li>モデル</li>
                <li>ネットワーキング</li>
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
                <li>Android 上の Jetpack Compose</li>
                <li>iOS 上の SwiftUI</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/msasikanth/twine">Twine - RSS Reader</a></strong>
        </td>
        <td>Twine は Kotlin と Compose Multiplatform を使用して構築されたマルチプラットフォーム RSS リーダーアプリです。フィードを閲覧するための優れたユーザーインターフェースとエクスペリエンスを備え、Material 3 のコンテンツベースの動的テーマをサポートしています。
        </td>
        <td>
            <list>
                <li>モデル</li>
                <li>ネットワーキング</li>
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
                <li>Android および iOS 上の Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/razaghimahdi/Shopping-By-KMP">Shopping By KMP</a></strong>
        </td>
        <td>Kotlin を使用して複数のプラットフォーム間で UI を共有するための宣言型フレームワークである Jetpack Compose Multiplatform を使用して構築されたクロスプラットフォームアプリケーションです。このアプリケーションにより、ユーザーは Android、iOS、ウェブ、デスクトップ、Android Automotive、Android TV でショッピングカタログから商品を閲覧、検索、購入できます。
        </td>
        <td>
            <list>
                <li>モデル</li>
                <li>ネットワーキング</li>
                <li>データストレージ</li>
                <li>UI</li>
                <li>ViewModel</li>
                <li>アニメーション</li>
                <li>ナビゲーション</li>
                <li>UI ステート</li>
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
                <li>Android、iOS、ウェブ、デスクトップ、automotive、Android TV 上の Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/SEAbdulbasit/MusicApp-KMP">Music App KMP</a></strong>
        </td>
        <td>MediaPlayer のようなネイティブ API と、異なるプラットフォームでどのようにやり取りするかを示すアプリケーションです。Spotify API を使用してデータをフェッチします。
        </td>
        <td>
            <list>
                <li>モデル</li>
                <li>ネットワーキング</li>
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
                <li>Android、iOS、デスクトップ、ウェブ上の Compose Multiplatform</li>
            </list>
        </td>
</tr>

    
<tr>
<td>
            <strong><a href="https://github.com/fethij/Rijksmuseum">Rijksmuseum</a></strong>
        </td>
        <td>Rijksmuseum は、Kotlin と Compose Multiplatform を使用したマルチモジュラーアプリで、アムステルダムにある有名な国立博物館の美術品コレクションを没入型で探索できる方法を提供します。Rijksmuseum API を利用して、画像や説明を含む様々な美術品の詳細情報を取得・表示します。
        </td>
        <td>
            <list>
                <li>UI</li>
                <li>モデル</li>
                <li>ネットワーキング</li>
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
                <li>Android、iOS、デスクトップ、ウェブ上の Compose Multiplatform</li>
            </list>
        </td>
</tr>

</table>