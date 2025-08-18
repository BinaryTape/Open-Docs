[//]: # (title: 環境設定)

初めてのKotlin Multiplatformアプリケーションを作成する前に、KMP開発のための環境をセットアップする必要があります。

## 必要なツールのインストール

互換性とパフォーマンス向上のため、最新の安定バージョンをインストールすることをお勧めします。

<table>
   
<tr>
<td>ツール</td>
      <td>コメント</td>
</tr>

    
<tr>
<td><a href="https://developer.android.com/studio">Android Studio</a></td>
        <td>Android Studioを使用してマルチプラットフォームアプリケーションを作成し、シミュレートされたデバイスまたはハードウェアデバイスで実行します。</td>
</tr>

    
<tr>
<td>
          <p><a href="https://apps.apple.com/us/app/xcode/id497799835">Xcode</a></p>
          <p>iOSアプリケーションをシミュレートされたデバイスまたは実機で実行したい場合、Xcodeが必要です。異なるオペレーティングシステムを使用している場合は、このツールをスキップしてください。</p>
        </td>
        <td>
          <p>別のウィンドウでXcodeを起動し、ライセンス条項に同意し、必要な初期タスクを実行できるようにします。</p>
          <p>ほとんどの場合、Xcodeはバックグラウンドで動作します。iOSアプリケーションにSwiftまたはObjective-Cのコードを追加するために使用します。</p>
            <note>
              <p>
                通常、すべてのツールで最新の安定バージョンを使用することをお勧めします。ただし、Kotlin/Nativeは、最新のXcodeにすぐには対応しない場合があります。サポートされているバージョンは<a href="multiplatform-compatibility-guide.md#version-compatibility">互換性ガイド</a>で確認できます。必要に応じて、<a href="https://developer.apple.com/download/all/?q=Xcode">以前のバージョンのXcodeをインストール</a>してください。
              </p>
            </note>   
      </td>
</tr>

   
<tr>
<td><a href="https://www.oracle.com/java/technologies/javase-downloads.html">JDK</a></td>
        <td>Javaがインストールされているか確認するには、Android Studioターミナルまたはコマンドラインで次のコマンドを実行します: <code style="block"
            lang="bash">java -version</code></td>
</tr>

   
<tr>
<td><Links href="/kmp/multiplatform-plugin-releases" summary="undefined">Kotlin Multiplatformプラグイン</Links></td>
        <td><p>Android Studioで、**設定** (**Preferences**) を開き、**Plugins**ページを見つけます。**Marketplace**タブで<i>Kotlin Multiplatform</i>を検索し、インストールします。</p>
</td>
</tr>

   
<tr>
<td><a href="https://kotlinlang.org/docs/releases.html#update-to-a-new-release">Kotlinプラグイン</a></td>
        <td>
            <p>Kotlinプラグインは、Android Studioのリリースごとにバンドルされ、自動的に更新されます。</p>
        </td>
</tr>

</table>

## 環境の確認

すべてが期待通りに動作するか確認するために、KDoctorツールをインストールして実行します:

> KDoctorはmacOSでのみ動作します。異なるオペレーティングシステムを使用している場合は、このステップをスキップしてください。
>
{style="note"}

1. Android Studioターミナルまたはコマンドラインツールで、Homebrewを使用してツールをインストールするために次のコマンドを実行します:

    ```bash
    brew install kdoctor
    ```

   Homebrewがまだない場合は、[インストール](https://brew.sh/)するか、他のインストール方法についてはKDoctorの[README](https://github.com/Kotlin/kdoctor#installation)を参照してください。
2. インストールが完了したら、コンソールでKDoctorを呼び出します: 

    ```bash
    kdoctor
    ```

3. KDoctorが環境チェック中に何らかの問題を診断した場合、出力を見て問題と可能な解決策を確認してください:

   * 失敗したチェック (`[x]`) を修正します。問題の説明と潜在的な解決策は、`*`記号の後に記載されています。
   * 警告 (`[!]`) と成功メッセージ (`[v]`) を確認します。これらにも役立つメモやヒントが含まれている場合があります。
   
   > CocoaPodsのインストールに関するKDoctorの警告は無視して構いません。最初のプロジェクトでは、別のiOSフレームワーク配布オプションを使用します。
   >
   {style="tip"}

## 考えられる問題と解決策

<deflist collapsible="true">
   <def title="KotlinとAndroid Studio">
      <list>
         <li>Android Studioがインストールされていることを確認してください。<a href="https://developer.android.com/studio">公式サイト</a>から入手できます。</li>
         <li>`Kotlin not configured`エラーに遭遇する可能性があります。これはAndroid Studio Giraffe 2022.3における既知の問題であり、プロジェクトのビルドと実行には影響しません。このエラーを回避するには、**Ignore**をクリックするか、Android Studio Hedgehog 2023.1にアップグレードしてください。</li>
         <li>最新のCompose Multiplatformを使用してUIコードを共有するには、プロジェクトでKotlin 2.1.0以上を使用し (現在のバージョンは%kotlinVersion%)、Kotlin 2.1.0以上でコンパイルされたライブラリにも依存する必要があります。そうしないと、リンクエラーが発生する可能性があります。
         </li>
      </list>
   </def>
   <def title="JavaとJDK">
         <list>
           <li>JDKがインストールされていることを確認してください。<a href="https://www.oracle.com/java/technologies/javase-downloads.html">公式サイト</a>から入手できます。</li>
           <li>Android StudioはバンドルされたJDKを使用してGradleタスクを実行します。Android StudioでGradle JDKを設定するには、**Settings/Preferences | Build, Execution, Deployment | Build Tools | Gradle**を選択します。</li>
           <li>`JAVA_HOME`に関連する問題に遭遇する可能性があります。この環境変数は、XcodeとGradleに必要なJavaバイナリの場所を指定します。その場合は、KDoctorのヒントに従って問題を修正してください。</li>
         </list>
   </def>
   <def title="Xcode">
      <list>
         <li>Xcodeがインストールされていることを確認してください。<a href="https://developer.apple.com/xcode/">公式サイト</a>から入手できます。</li>
         <li>まだXcodeを起動していない場合は、別のウィンドウで開いてください。ライセンス条項に同意し、必要な初期タスクを実行できるようにします。</li>
         <li><p>`Error: can't grab Xcode schemes`や、コマンドラインツールの選択に関するその他の問題に遭遇する可能性があります。この場合、次のいずれかを実行してください:</p>
             <list>
               <li><p>ターミナルで、以下を実行します:</p>
                   <code style="block"
                         lang="bash">sudo xcode-select --switch /Applications/Xcode.app</code>
               </li>
               <li>または、Xcodeで、**Settings | Locations**を選択します。**Command Line Tools**フィールドで、Xcodeのバージョンを選択します。
                   <img src="xcode-schemes.png" alt="Xcode schemes" width="500"/>
                   <p>`Xcode.app`へのパスが選択されていることを確認してください。必要に応じて、別のウィンドウでアクションを確定します。</p>
               </li>
             </list>
         </li>
      </list>
   </def>
   <def title="Kotlinプラグイン">
         <snippet>
            <p><strong>Kotlin Multiplatformプラグイン</strong></p>
               <list>
                  <li>Kotlin Multiplatformプラグインがインストールされ、有効になっていることを確認してください。Android Studioのようこそ画面で、**Plugins | Installed**を選択します。プラグインが有効になっていることを確認します。**Installed**リストにない場合は、**Marketplace**で検索してプラグインをインストールします。</li>
                  <li>プラグインが古い場合は、プラグイン名の横にある**Update**をクリックします。**Settings/Preferences | Tools | Plugins**セクションでも同様に操作できます。</li>
                  <li>Kotlin Multiplatformプラグインと使用しているKotlinのバージョンの互換性は、<a href="multiplatform-plugin-releases.md#release-details">リリース詳細</a>テーブルで確認してください。</li>
               </list>
         </snippet>
         <snippet>
            <p><strong>Kotlinプラグイン</strong></p>
            <p>Kotlinプラグインが最新バージョンに更新されていることを確認してください。そのためには、Android Studioのようこそ画面で、**Plugins | Installed**を選択します。Kotlinの横にある**Update**をクリックします。</p>
         </snippet>
   </def>
   <def title="コマンドライン">
            <p>必要なツールがすべてインストールされていることを確認してください:</p>
            <list>
              <li>`command not found: brew` – <a href="https://brew.sh/">Homebrewをインストール</a>。</li>
              <li>`command not found: java` – <a href="https://www.oracle.com/java/technologies/javase-downloads.html">Javaをインストール</a>。</li>
           </list>
    </def>
   <def title="まだ問題がありますか？">
            <p><a href="https://kotl.in/issue">YouTrack issueを作成</a>して、チームに問題を共有してください。</p>
   </def>
</deflist>

## ヘルプ

*   **Kotlin Slack**。[招待](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)を受けて、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU)チャンネルに参加してください。
*   **Kotlin issue tracker**。[新しいissueを報告](https://youtrack.jetbrains.com/newIssue?project=KT)してください。