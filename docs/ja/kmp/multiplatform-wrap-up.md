[//]: # (title: プロジェクトを完了する)

<tldr>
    <p>これは、**共有ロジックとネイティブUIを持つKotlinマルチプラットフォームアプリの作成**チュートリアルの最終パートです。先に進む前に、前の手順を完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <Links href="/kmp/multiplatform-create-first-app" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the first part of the Create a Kotlin Multiplatform app with shared logic and native UI tutorial. Create your Kotlin Multiplatform app Update the user interface Add dependencies Share more logic Wrap up your project">Kotlinマルチプラットフォームアプリを作成する</Links><br/>
       <img src="icon-2-done.svg" width="20" alt="Second step"/> <Links href="/kmp/multiplatform-update-ui" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the second part of the Create a Kotlin Multiplatform app with shared logic and native UI tutorial. Before proceeding, make sure you've completed previous steps. Create your Kotlin Multiplatform app Update the user interface Add dependencies Share more logic Wrap up your project">ユーザーインターフェースを更新する</Links><br/>
       <img src="icon-3-done.svg" width="20" alt="Third step"/> <Links href="/kmp/multiplatform-dependencies" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the third part of the Create a Kotlin Multiplatform app with shared logic and native UI tutorial. Before proceeding, make sure you've completed previous steps. Create your Kotlin Multiplatform app Update the user interface Add dependencies Share more logic Wrap up your project">依存関係を追加する</Links><br/>
       <img src="icon-4-done.svg" width="20" alt="Fourth step"/> <Links href="/kmp/multiplatform-upgrade-app" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the fourth part of the Create a Kotlin Multiplatform app with shared logic and native UI tutorial. Before proceeding, make sure you've completed previous steps. Create your Kotlin Multiplatform app Update the user interface Add dependencies Share more logic Wrap up your project">さらにロジックを共有する</Links><br/>
       <img src="icon-5.svg" width="20" alt="Fifth step"/> <strong>プロジェクトを完了する</strong><br/>
    </p>
</tldr>

iOSとAndroidの両方で動作する最初のKotlinマルチプラットフォームアプリが作成できました！これで、クロスプラットフォームのモバイル開発環境をセットアップし、IntelliJ IDEAでプロジェクトを作成し、デバイスでアプリを実行し、その機能を拡張する方法を習得しました。

Kotlin Multiplatformでいくらか経験を積んだ今、いくつかの高度なトピックを見て、追加のクロスプラットフォームモバイル開発タスクに取り組むことができます。

<table>
   
<tr>
<th>次のステップ</th>
      <th>詳細</th>
</tr>

   
<tr>
<td>
     <list>
        <li><Links href="/kmp/multiplatform-run-tests" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support.">Kotlinマルチプラットフォームプロジェクトにテストを追加する</Links></li>
        <li><Links href="/kmp/multiplatform-publish-apps" summary="undefined">モバイルアプリケーションをアプリストアに公開する</Links></li>
        <li><Links href="/kmp/multiplatform-introduce-your-team" summary="undefined">チームにクロスプラットフォームモバイル開発を導入する</Links></li>
        <li><a href="https://klibs.io/">ターゲットプラットフォームで利用可能なKotlin Multiplatformライブラリを閲覧する</a></li>
        <li><a href="https://github.com/terrakok/kmm-awesome">役立つツールとリソースのリストを確認する</a></li>
     </list>
   </td>
    <td>
     <list>
        <li><Links href="/kmp/multiplatform-discover-project" summary="undefined">Kotlinマルチプラットフォームプロジェクトの構造</Links></li>
        <li><a href="https://kotlinlang.org/docs/native-objc-interop.html">Objective-Cフレームワークおよびライブラリとの相互運用性</a></li>
        <li><Links href="/kmp/multiplatform-add-dependencies" summary="undefined">マルチプラットフォームライブラリへの依存関係の追加</Links></li>        
        <li><Links href="/kmp/multiplatform-android-dependencies" summary="undefined">Androidの依存関係の追加</Links></li>
        <li><Links href="/kmp/multiplatform-ios-dependencies" summary="undefined">iOSの依存関係の追加</Links></li>
     </list>
   </td>
</tr>

</table>

<table>
   
<tr>
<th>チュートリアルとサンプル</th>
      <th>コミュニティとフィードバック</th>
</tr>

   
<tr>
<td>
     <list>
        <li><Links href="/kmp/multiplatform-integrate-in-existing-app" summary="This tutorial uses Android Studio, but you can also follow it in IntelliJ IDEA. When set up properly, both IDEs share the same core functionality and Kotlin Multiplatform support.">Androidアプリをクロスプラットフォームにする</Links></li>
        <li><Links href="/kmp/multiplatform-ktor-sqldelight" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support.">KtorとSQLDelightを使用してマルチプラットフォームアプリを作成する</Links></li>
        <li><Links href="/kmp/compose-multiplatform-create-first-app" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the first part of the Create a Compose Multiplatform app with shared logic and UI tutorial. Create your Compose Multiplatform app Explore composable code Modify the project Create your own application">Compose Multiplatformを使用してiOSとAndroid間でUIを共有する</Links></li>
        <li><Links href="/kmp/multiplatform-samples" summary="undefined">キュレーションされたサンプルプロジェクトのリストを見る</Links></li>
     </list>
   </td>
    <td>
     <list>
        <li><a href="https://kotlinlang.slack.com/archives/C3PQML5NU">Kotlin Slackの#multiplatformチャンネルに参加する</a></li>
        <li><a href="https://stackoverflow.com/questions/tagged/kotlin-multiplatform">Stack Overflowで「kotlin-multiplatform」タグを購読する</a></li>        
        <li><a href="https://www.youtube.com/playlist?list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C">Kotlin YouTubeチャンネルを購読する</a></li>
        <li><a href="https://youtrack.jetbrains.com/newIssue?project=KT">イシュートラッカーに問題を報告する</a></li>
     </list>
   </td>
</tr>

</table>