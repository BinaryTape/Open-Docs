[//]: # (title: 環境をセットアップする)

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
        <td>Android Studioを使用して、マルチプラットフォームアプリケーションを作成し、シミュレーターまたは実機で実行します。</td>
    </tr>
    <tr>
        <td>
          <p><a href="https://apps.apple.com/us/app/xcode/id497799835">Xcode</a></p>
          <p>iOSアプリケーションをシミュレーターまたは実機で実行する場合、Xcodeが必要です。別のオペレーティングシステムを使用している場合は、このツールをスキップしてください。</p>
        </td>
        <td>
          <p>Xcodeを別のウィンドウで起動し、ライセンス条項に同意して、必要な初期タスクを実行できるようにします。</p>
          <p>ほとんどの場合、Xcodeはバックグラウンドで動作します。iOSアプリケーションにSwiftまたはObjective-Cコードを追加する際に使用します。</p>
            <note>
              <p>
                通常、すべてのツールは最新の安定バージョンを使用することをお勧めします。ただし、Kotlin/Nativeは最新のXcodeにすぐに対応しない場合があります。サポートされているバージョンは<a href="multiplatform-compatibility-guide.md#version-compatibility">互換性ガイド</a>で確認でき、必要に応じて<a href="https://developer.apple.com/download/all/?q=Xcode">以前のバージョンのXcodeをインストール</a>できます。
              </p>
            </note>   
      </td>
   </tr>
   <tr>
        <td><a href="https://www.oracle.com/java/technologies/javase-downloads.html">JDK</a></td>
        <td>Javaがインストールされているかを確認するには、Android Studioのターミナルまたはコマンドラインで次のコマンドを実行します: <code style="block"
            lang="bash">java -version</code></td>
   </tr>
   <tr>
        <td><a href="multiplatform-plugin-releases.md">Kotlin Multiplatform plugin</a></td>
        <td><p>Android Studioで、<strong>Settings</strong> (<strong>Preferences</strong>) を開き、<strong>Plugins</strong>ページを探します。<strong>Marketplace</strong>タブで<i>Kotlin Multiplatform</i>を検索し、インストールします。</p>
</td>
   </tr>
   <tr>
        <td><a href="https://kotlinlang.org/docs/releases.html#update-to-a-new-release">Kotlin plugin</a></td>
        <td>
            <p>Kotlinプラグインは、Android Studioの各リリースにバンドルされており、自動的に更新されます。</p>
        </td>
   </tr>
</table>

## 環境を確認する

すべてが期待どおりに動作することを確認するために、KDoctorツールをインストールして実行します。

> KDoctorはmacOSでのみ動作します。別のオペレーティングシステムを使用している場合は、このステップをスキップしてください。
>
{style="note"}

1. Android Studioのターミナルまたはコマンドラインツールで、Homebrewを使用してツールをインストールするために次のコマンドを実行します。

    ```bash
    brew install kdoctor
    ```

   まだHomebrewをお持ちでない場合は、[インストール](https://brew.sh/)するか、KDoctorの[README](https://github.com/Kotlin/kdoctor#installation)で他のインストール方法を参照してください。
2. インストールが完了したら、コンソールでKDoctorを実行します。

    ```bash
    kdoctor
    ```

3. KDoctorが環境の確認中に何らかの問題を診断した場合は、出力を見て問題と解決策を確認してください。

   * 失敗したチェック (`[x]`) を修正します。問題の説明と潜在的な解決策は`*`記号の後に記載されています。
   * 警告 (`[!]`) と成功メッセージ (`[v]`) を確認します。これらにも役立つメモやヒントが含まれている場合があります。

   > CocoaPodsのインストールに関するKDoctorの警告は無視して構いません。最初のプロジェクトでは、別のiOSフレームワーク配布オプションを使用します。
   >
   {style="tip"}

## 発生しうる問題と解決策

<deflist collapsible="true">
   <def title="KotlinとAndroid Studio">
      <list>
         <li>Android Studioがインストールされていることを確認してください。これは<a href="https://developer.android.com/studio">公式ウェブサイト</a>から入手できます。</li>
         <li>`Kotlin not configured` エラーに遭遇する場合があります。これはAndroid Studio Giraffe 2022.3の既知の問題であり、プロジェクトのビルドや実行には影響しません。エラーを回避するには、<strong>Ignore</strong>をクリックするか、Android Studio Hedgehog 2023.1にアップグレードしてください。</li>
         <li>最新のCompose Multiplatformを使用してUIコードを共有するには、プロジェクトに少なくともKotlin 2.1.0 (現在のバージョンは%kotlinVersion%) を使用し、少なくともKotlin 2.1.0向けにコンパイルされたライブラリにも依存してください。そうしないと、リンクエラーが発生する可能性があります。</li>
      </list>
   </def>
   <def title="JavaとJDK">
         <list>
           <li>JDKがインストールされていることを確認してください。これは<a href="https://www.oracle.com/java/technologies/javase-downloads.html">公式ウェブサイト</a>から入手できます。</li>
           <li>Android StudioはバンドルされたJDKを使用してGradleタスクを実行します。Android StudioでGradle JDKを構成するには、<strong>Settings/Preferences | Build, Execution, Deployment | Build Tools | Gradle</strong>を選択します。</li>
           <li>`JAVA_HOME`に関連する問題に遭遇する場合があります。この環境変数は、XcodeとGradleに必要なJavaバイナリの場所を指定します。その場合は、KDoctorのヒントに従って問題を修正してください。</li>
         </list>
   </def>
   <def title="Xcode">
      <list>
         <li>Xcodeがインストールされていることを確認してください。これは<a href="https://developer.apple.com/xcode/">公式ウェブサイト</a>から入手できます。</li>
         <li>まだXcodeを起動していない場合は、別のウィンドウで開いてください。ライセンス条項に同意し、必要な初期タスクを実行できるようにします。</li>
         <li><p><code>Error: can't grab Xcode schemes</code> またはコマンドラインツールの選択に関するその他の問題に遭遇する場合があります。この場合、次のいずれかを実行してください。</p>
             <list>
               <li><p>ターミナルで次を実行します。</p>
                   <code style="block"
                         lang="bash">sudo xcode-select --switch /Applications/Xcode.app</code>
               </li>
               <li>または、Xcodeで<strong>Settings | Locations</strong>を選択します。<strong>Command Line Tools</strong>フィールドで、ご使用のXcodeバージョンを選択します。
                   <img src="xcode-schemes.png" alt="Xcode schemes" width="500"/>
                   <p>`Xcode.app`へのパスが選択されていることを確認します。必要に応じて別のウィンドウでアクションを確定します。</p>
               </li>
             </list>
         </li>
      </list>
   </def>
   <def title="Kotlinプラグイン">
         <snippet>
            <p><strong>Kotlin Multiplatformプラグイン</strong></p>
               <list>
                  <li>Kotlin Multiplatformプラグインがインストールされ、有効になっていることを確認します。Android Studioのウェルカム画面で、<strong>Plugins | Installed</strong>を選択します。プラグインが有効になっていることを確認します。<strong>Installed</strong>リストにない場合は、<strong>Marketplace</strong>で検索してインストールします。</li>
                  <li>プラグインが古い場合は、プラグイン名の横にある<strong>Update</strong>をクリックします。同じことを<strong>Settings/Preferences | Tools | Plugins</strong>セクションでも行えます。</li>
                  <li><a href="multiplatform-plugin-releases.md#release-details">リリース詳細</a>テーブルで、Kotlin Multiplatformプラグインとご使用のKotlinバージョンの互換性を確認してください。</li>
               </list>
         </snippet>
         <snippet>
            <p><strong>Kotlinプラグイン</strong></p>
            <p>Kotlinプラグインが最新バージョンに更新されていることを確認します。これを行うには、Android Studioのウェルカム画面で、<strong>Plugins | Installed</strong>を選択します。Kotlinの横にある<strong>Update</strong>をクリックします。</p>
         </snippet>
   </def>
   <def title="コマンドライン">
            <p>必要なツールがすべてインストールされていることを確認してください。</p>
            <list>
              <li>`command not found: brew` – <a href="https://brew.sh/">Homebrewをインストール</a>します。</li>
              <li>`command not found: java` – <a href="https://www.oracle.com/java/technologies/javase-downloads.html">Javaをインストール</a>します。</li>
           </list>
    </def>
   <def title="まだ問題がありますか？">
            <p><a href="https://kotl.in/issue">YouTrackイシューを作成</a>して、チームと問題を共有してください。</p>
   </def>
</deflist>

## ヘルプを参照する

*   **Kotlin Slack**。<a href="https://surveys.jetbrains.com/s3/kotlin-slack-sign-up">招待を受け取り</a>、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU)チャンネルに参加してください。
*   **Kotlin課題トラッカー**。<a href="https://youtrack.jetbrains.com/newIssue?project=KT">新しい課題を報告</a>してください。