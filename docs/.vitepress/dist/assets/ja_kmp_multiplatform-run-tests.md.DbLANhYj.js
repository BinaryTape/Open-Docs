import{_ as l,a as e,b as r,c as o,d as h,e as k,f as c}from"./chunks/multiplatform-test-report.CawuKTkU.js";import{_ as d,C as p,c as u,o as g,j as n,G as a,ag as E,a as m,w as y}from"./chunks/framework.Bksy39di.js";const T=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/kmp/multiplatform-run-tests.md","filePath":"ja/kmp/multiplatform-run-tests.md","lastUpdated":1755516278000}'),F={name:"ja/kmp/multiplatform-run-tests.md"};function C(q,s,v,b,f,A){const i=p("secondary-label"),t=p("tldr");return g(),u("div",null,[s[1]||(s[1]=n("h1",{id:"マルチプラットフォームアプリをテストする-−-チュートリアル",tabindex:"-1"},[m("マルチプラットフォームアプリをテストする − チュートリアル "),n("a",{class:"header-anchor",href:"#マルチプラットフォームアプリをテストする-−-チュートリアル","aria-label":'Permalink to "マルチプラットフォームアプリをテストする − チュートリアル"'},"​")],-1)),a(i,{ref:"IntelliJ IDEA"},null,512),a(i,{ref:"Android Studio"},null,512),a(t,null,{default:y(()=>s[0]||(s[0]=[n("p",null,"このチュートリアルではIntelliJ IDEAを使用しますが、Android Studioでも同様に学習を進められます。両方のIDEは同じコア機能とKotlin Multiplatformサポートを共有しています。",-1)])),_:1}),s[2]||(s[2]=E('<p>このチュートリアルでは、Kotlin Multiplatformアプリケーションでテストを作成、構成、実行する方法を学習します。</p><p>マルチプラットフォームプロジェクトのテストは、次の2つのカテゴリに分類できます。</p><ul><li>共通コードのテスト。これらのテストは、サポートされている任意のフレームワークを使用して、任意のプラットフォームで実行できます。</li><li>プラットフォーム固有のコードのテスト。これらは、プラットフォーム固有のロジックをテストするために不可欠です。これらはプラットフォーム固有のフレームワークを使用し、より豊富なAPIや幅広いアサーションなど、その追加機能の恩恵を受けることができます。</li></ul><p>どちらのカテゴリもマルチプラットフォームプロジェクトでサポートされています。このチュートリアルでは、まずシンプルなKotlin Multiplatformプロジェクトで共通コードの単体テストのセットアップ、作成、実行方法を示します。次に、共通コードとプラットフォーム固有コードの両方にテストが必要な、より複雑な例を扱います。</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>このチュートリアルは、以下に精通していることを前提としています。 * Kotlin Multiplatformプロジェクトのレイアウト。そうでない場合は、開始する前に<a href="./multiplatform-create-first-app">このチュートリアル</a>を完了してください。 * <a href="https://junit.org/junit5/" target="_blank" rel="noreferrer">JUnit</a>などの一般的な単体テストフレームワークの基本。</p></div><h2 id="シンプルなマルチプラットフォームプロジェクトをテストする" tabindex="-1">シンプルなマルチプラットフォームプロジェクトをテストする <a class="header-anchor" href="#シンプルなマルチプラットフォームプロジェクトをテストする" aria-label="Permalink to &quot;シンプルなマルチプラットフォームプロジェクトをテストする&quot;">​</a></h2><h3 id="プロジェクトの作成" tabindex="-1">プロジェクトの作成 <a class="header-anchor" href="#プロジェクトの作成" aria-label="Permalink to &quot;プロジェクトの作成&quot;">​</a></h3><ol><li><p><a href="./quickstart">クイックスタート</a>で、<a href="./quickstart#set-up-the-environment">Kotlin Multiplatform開発環境のセットアップ</a>の手順を完了します。</p></li><li><p>IntelliJ IDEAで、<strong>File</strong> | <strong>New</strong> | <strong>Project</strong>を選択します。</p></li><li><p>左側のパネルで、<strong>Kotlin Multiplatform</strong>を選択します。</p></li><li><p><strong>New Project</strong>ウィンドウで以下のフィールドを指定します。</p><ul><li><strong>Name</strong>: KotlinProject</li><li><strong>Group</strong>: kmp.project.demo</li><li><strong>Artifact</strong>: kotlinproject</li><li><strong>JDK</strong>: Amazon Corretto version 17<div class="note custom-block"><p class="custom-block-title">NOTE</p><p>このJDKバージョンは、後で追加するテストの1つを正常に実行するために必要です。</p></div></li></ul></li><li><p><strong>Android</strong>ターゲットを選択します。</p><ul><li>Macを使用している場合は、<strong>iOS</strong>も選択します。<strong>UIを共有しない</strong>オプションが選択されていることを確認してください。</li></ul></li><li><p><strong>Include tests</strong>の選択を解除し、<strong>Create</strong>をクリックします。</p></li></ol><p><img src="'+l+`" alt="シンプルなマルチプラットフォームプロジェクトの作成" width="800"></p><h3 id="コードの記述" tabindex="-1">コードの記述 <a class="header-anchor" href="#コードの記述" aria-label="Permalink to &quot;コードの記述&quot;">​</a></h3><p><code>shared/src/commonMain/kotlin</code>ディレクトリに、新しい<code>common.example.search</code>ディレクトリを作成します。 このディレクトリに、次の関数を含むKotlinファイル<code>Grep.kt</code>を作成します。</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> grep</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(lines: </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">List</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;, pattern: </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, action: (</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) -&gt; </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Unit</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> regex </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> pattern.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">toRegex</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    lines.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">filter</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(regex::</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">containsMatchIn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">forEach</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(action)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>この関数は、<a href="https://en.wikipedia.org/wiki/Grep" target="_blank" rel="noreferrer">UNIXの<code>grep</code>コマンド</a>に似せて設計されています。ここでは、テキストの行、正規表現として使用されるパターン、および行がパターンに一致するたびに呼び出される関数を受け取ります。</p><h3 id="テストの追加" tabindex="-1">テストの追加 <a class="header-anchor" href="#テストの追加" aria-label="Permalink to &quot;テストの追加&quot;">​</a></h3><p>次に、共通コードをテストしましょう。重要な部分となるのは、共通テスト用のソースセットです。これには<a href="https://kotlinlang.org/api/latest/kotlin.test/" target="_blank" rel="noreferrer"><code>kotlin.test</code></a> APIライブラリが依存関係として含まれています。</p><ol><li><p><code>shared/build.gradle.kts</code>ファイルで、<code>kotlin.test</code>ライブラリへの依存関係があることを確認します。</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"></span></code></pre></div></li></ol><p>sourceSets { //... commonTest.dependencies { implementation(libs.kotlin.test) } }</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>2.  \`commonTest\`ソースセットは、すべての共通テストを格納します。プロジェクト内に同じ名前のディレクトリを作成する必要があります。</span></span>
<span class="line"><span></span></span>
<span class="line"><span> 1.  \`shared/src\`ディレクトリを右クリックし、**New | Directory**を選択します。IDEにオプションのリストが表示されます。</span></span>
<span class="line"><span> 2.  \`commonTest/kotlin\`パスの入力を開始して選択肢を絞り込み、リストから選択します。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   ![共通テストディレクトリの作成](create-common-test-dir.png){width=350}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3.  \`commonTest/kotlin\`ディレクトリに、新しい\`common.example.search\`パッケージを作成します。</span></span>
<span class="line"><span>4.  このパッケージに、\`Grep.kt\`ファイルを作成し、次の単体テストで更新します。</span></span>
<span class="line"><span></span></span>
<span class="line"><span> \`\`\`kotlin</span></span>
<span class="line"><span> import kotlin.test.Test</span></span>
<span class="line"><span> import kotlin.test.assertContains</span></span>
<span class="line"><span> import kotlin.test.assertEquals</span></span>
<span class="line"><span> </span></span>
<span class="line"><span> class GrepTest {</span></span>
<span class="line"><span>     companion object {</span></span>
<span class="line"><span>         val sampleData = listOf(</span></span>
<span class="line"><span>             &quot;123 abc&quot;,</span></span>
<span class="line"><span>             &quot;abc 123&quot;,</span></span>
<span class="line"><span>             &quot;123 ABC&quot;,</span></span>
<span class="line"><span>             &quot;ABC 123&quot;</span></span>
<span class="line"><span>         )</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>     @Test</span></span>
<span class="line"><span>     fun shouldFindMatches() {</span></span>
<span class="line"><span>         val results = mutableListOf&lt;String&gt;()</span></span>
<span class="line"><span>         grep(sampleData, &quot;[a-z]+&quot;) {</span></span>
<span class="line"><span>             results.add(it)</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>         assertEquals(2, results.size)</span></span>
<span class="line"><span>         for (result in results) {</span></span>
<span class="line"><span>             assertContains(result, &quot;abc&quot;)</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> \`\`\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ご覧のとおり、インポートされたアノテーションとアサーションは、プラットフォーム固有でもフレームワーク固有でもありません。このテストを後で実行すると、プラットフォーム固有のフレームワークがテストランナーを提供します。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### \`kotlin.test\` APIを調べる {initial-collapse-state=&quot;collapsed&quot; collapsible=&quot;true&quot;}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[\`kotlin.test\`](https://kotlinlang.org/api/latest/kotlin.test/)ライブラリは、テストで使用できるプラットフォームに依存しないアノテーションとアサーションを提供します。\`Test\`などのアノテーションは、選択したフレームワークによって提供されるもの、またはそれらに最も近い同等のものにマッピングされます。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>アサーションは、[\`Asserter\`インターフェース](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-asserter/)の実装を通じて実行されます。このインターフェースは、テストで一般的に行われるさまざまなチェックを定義します。APIにはデフォルトの実装がありますが、通常はフレームワーク固有の実装を使用します。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>たとえば、JUnit 4、JUnit 5、TestNGフレームワークはすべてJVMでサポートされています。Androidでは、\`assertEquals()\`の呼び出しが、\`asserter\`オブジェクトが\`JUnit4Asserter\`のインスタンスである\`asserter.assertEquals()\`の呼び出しにつながる可能性があります。iOSでは、\`Asserter\`型のデフォルト実装がKotlin/Nativeテストランナーと組み合わせて使用されます。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### テストの実行</span></span>
<span class="line"><span></span></span>
<span class="line"><span>テストは次の方法で実行できます。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>*   ガターの**Run**アイコンを使用して\`shouldFindMatches()\`テスト関数を実行する。</span></span>
<span class="line"><span>*   コンテキストメニューを使用してテストファイルを実行する。</span></span>
<span class="line"><span>*   ガターの**Run**アイコンを使用して\`GrepTest\`テストクラスを実行する。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>便利な&lt;shortcut&gt;⌃ ⇧ F10&lt;/shortcut&gt;/&lt;shortcut&gt;Ctrl+Shift+F10&lt;/shortcut&gt;ショートカットもあります。</span></span>
<span class="line"><span>どのオプションを選択しても、テストを実行するターゲットのリストが表示されます。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![テストタスクの実行](run-test-tasks.png){width=300}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`android\`オプションの場合、テストはJUnit 4を使用して実行されます。\`iosSimulatorArm64\`の場合、Kotlinコンパイラはテストアノテーションを検出し、Kotlin/Native独自のテストランナーによって実行される_テストバイナリ_を作成します。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>テストが正常に実行された場合の出力例を以下に示します。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![テスト出力](run-test-results.png){width=700}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## より複雑なプロジェクトを扱う</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 共通コードのテストを記述する</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`grep()\`関数を使用して、共通コードのテストをすでに作成しました。次に、\`CurrentRuntime\`クラスを使った、より高度な共通コードテストを考えてみましょう。このクラスには、コードが実行されるプラットフォームの詳細が含まれています。</span></span>
<span class="line"><span>たとえば、ローカルJVMで実行されるAndroid単体テストの場合、&quot;OpenJDK&quot;と&quot;17.0&quot;の値を持つことがあります。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`CurrentRuntime\`のインスタンスは、プラットフォームの名前とバージョンを文字列として作成する必要があります。バージョンはオプションです。バージョンが存在する場合、文字列の先頭にある数字のみが必要です（利用可能な場合）。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1.  \`commonMain/kotlin\`ディレクトリに、新しい\`org.kmp.testing\`ディレクトリを作成します。</span></span>
<span class="line"><span>2.  このディレクトリに、\`CurrentRuntime.kt\`ファイルを作成し、次の実装で更新します。</span></span>
<span class="line"><span></span></span>
<span class="line"><span> \`\`\`kotlin</span></span>
<span class="line"><span> class CurrentRuntime(val name: String, rawVersion: String?) {</span></span>
<span class="line"><span>     companion object {</span></span>
<span class="line"><span>         val versionRegex = Regex(&quot;^[0-9]+(\\\\.[0-9]+)?&quot;)</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>     val version = parseVersion(rawVersion)</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>     override fun toString() = &quot;$name version $version&quot;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>     private fun parseVersion(rawVersion: String?): String {</span></span>
<span class="line"><span>         val result = rawVersion?.let { versionRegex.find(it) }</span></span>
<span class="line"><span>         return result?.value ?: &quot;unknown&quot;</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> \`\`\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3.  \`commonTest/kotlin\`ディレクトリに、新しい\`org.kmp.testing\`パッケージを作成します。</span></span>
<span class="line"><span>4.  このパッケージに、\`CurrentRuntimeTest.kt\`ファイルを作成し、以下のプラットフォームとフレームワークに依存しないテストで更新します。</span></span>
<span class="line"><span></span></span>
<span class="line"><span> \`\`\`kotlin</span></span>
<span class="line"><span> import kotlin.test.Test</span></span>
<span class="line"><span> import kotlin.test.assertEquals</span></span>
<span class="line"><span></span></span>
<span class="line"><span> class CurrentRuntimeTest {</span></span>
<span class="line"><span>     @Test</span></span>
<span class="line"><span>     fun shouldDisplayDetails() {</span></span>
<span class="line"><span>         val runtime = CurrentRuntime(&quot;MyRuntime&quot;, &quot;1.1&quot;)</span></span>
<span class="line"><span>         assertEquals(&quot;MyRuntime version 1.1&quot;, runtime.toString())</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>     @Test</span></span>
<span class="line"><span>     fun shouldHandleNullVersion() {</span></span>
<span class="line"><span>         val runtime = CurrentRuntime(&quot;MyRuntime&quot;, null)</span></span>
<span class="line"><span>         assertEquals(&quot;MyRuntime version unknown&quot;, runtime.toString())</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>     @Test</span></span>
<span class="line"><span>     fun shouldParseNumberFromVersionString() {</span></span>
<span class="line"><span>         val runtime = CurrentRuntime(&quot;MyRuntime&quot;, &quot;1.2 Alpha Experimental&quot;)</span></span>
<span class="line"><span>         assertEquals(&quot;MyRuntime version 1.2&quot;, runtime.toString())</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>     @Test</span></span>
<span class="line"><span>     fun shouldHandleMissingVersion() {</span></span>
<span class="line"><span>         val runtime = CurrentRuntime(&quot;MyRuntime&quot;, &quot;Alpha Experimental&quot;)</span></span>
<span class="line"><span>         assertEquals(&quot;MyRuntime version unknown&quot;, runtime.toString())</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> \`\`\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>このテストは、[IDEで利用可能な](#run-tests)いずれかの方法で実行できます。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### プラットフォーム固有のテストを追加する</span></span>
<span class="line"><span></span></span>
<span class="line"><span>::: note</span></span>
<span class="line"><span>ここでは、簡潔さとシンプルさのために[expectedおよびactual宣言のメカニズム](multiplatform-connect-to-apis.md)が使用されています。より複雑なコードでは、インターフェースとファクトリ関数を使用する方が良いアプローチです。</span></span>
<span class="line"><span>:::</span></span>
<span class="line"><span>共通コードのテストを作成する経験を積んだところで、AndroidとiOS用のプラットフォーム固有のテストを作成することを探ってみましょう。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`CurrentRuntime\`のインスタンスを作成するには、共通の\`CurrentRuntime.kt\`ファイルで次のように関数を宣言します。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`kotlin</span></span>
<span class="line"><span>expect fun determineCurrentRuntime(): CurrentRuntime</span></span></code></pre></div><p>この関数は、サポートされている各プラットフォームに個別の実装を持つ必要があります。そうしないと、ビルドが失敗します。 各プラットフォームでこの関数を実装するだけでなく、テストも提供する必要があります。AndroidとiOS用に作成しましょう。</p><h4 id="androidの場合" tabindex="-1">Androidの場合 <a class="header-anchor" href="#androidの場合" aria-label="Permalink to &quot;Androidの場合&quot;">​</a></h4><ol><li><p><code>androidMain/kotlin</code>ディレクトリに、新しい<code>org.kmp.testing</code>パッケージを作成します。</p></li><li><p>このパッケージに、<code>AndroidRuntime.kt</code>ファイルを作成し、expected <code>determineCurrentRuntime()</code>関数の実際の（actual）実装で更新します。</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">actual </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> determineCurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(): </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">CurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> name </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> System.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getProperty</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;java.vm.name&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) ?: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Android&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> version </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> System.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getProperty</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;java.version&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> CurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(name, version)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div></li><li><p><code>shared/src</code>ディレクトリ内にテスト用のディレクトリを作成します。</p></li><li><p><code>shared/src</code>ディレクトリを右クリックし、<strong>New | Directory</strong>を選択します。IDEにオプションのリストが表示されます。</p></li><li><p><code>androidUnitTest/kotlin</code>パスの入力を開始して選択肢を絞り込み、リストから選択します。</p></li></ol><p><img src="`+e+`" alt="Androidテストディレクトリの作成" width="350"></p><ol start="4"><li><p><code>kotlin</code>ディレクトリに、新しい<code>org.kmp.testing</code>パッケージを作成します。</p></li><li><p>このパッケージに、<code>AndroidRuntimeTest.kt</code>ファイルを作成し、次のAndroidテストで更新します。</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.test.Test</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.test.assertContains</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.test.assertEquals</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> AndroidRuntimeTest</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    @Test</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> shouldDetectAndroid</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> runtime </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> determineCurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        assertContains</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(runtime.name, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;OpenJDK&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        assertEquals</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(runtime.version, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;17.0&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div></li></ol><div class="note custom-block"><p class="custom-block-title">NOTE</p><p>チュートリアルの最初に異なるJDKバージョンを選択した場合、テストを正常に実行するために<code>name</code>と<code>version</code>を変更する必要があるかもしれません。</p></div><p>Android固有のテストがローカルJVMで実行されるのは奇妙に思えるかもしれません。これは、これらのテストが現在のマシンでローカル単体テストとして実行されるためです。<a href="https://developer.android.com/studio/test/test-in-android-studio" target="_blank" rel="noreferrer">Android Studioのドキュメント</a>に記載されているように、これらのテストはデバイスやエミュレーターで実行されるインスツルメンテッドテストとは異なります。</p><p>プロジェクトに他の種類のテストを追加できます。インスツルメンテッドテストについて学ぶには、<a href="https://touchlab.co/understanding-and-configuring-your-kmm-test-suite/" target="_blank" rel="noreferrer">Touchlabのこのガイド</a>を参照してください。</p><h4 id="iosの場合" tabindex="-1">iOSの場合 <a class="header-anchor" href="#iosの場合" aria-label="Permalink to &quot;iOSの場合&quot;">​</a></h4><ol><li><p><code>iosMain/kotlin</code>ディレクトリに、新しい<code>org.kmp.testing</code>ディレクトリを作成します。</p></li><li><p>このディレクトリに、<code>IOSRuntime.kt</code>ファイルを作成し、expected <code>determineCurrentRuntime()</code>関数の実際の（actual）実装で更新します。</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.experimental.ExperimentalNativeApi</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.native.Platform</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">@OptIn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(ExperimentalNativeApi::</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">actual </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> determineCurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(): </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">CurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> name </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Platform.osFamily.name.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">lowercase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> CurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(name, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div></li><li><p><code>shared/src</code>ディレクトリに新しいディレクトリを作成します。</p></li><li><p><code>shared/src</code>ディレクトリを右クリックし、<strong>New | Directory</strong>を選択します。IDEにオプションのリストが表示されます。</p></li><li><p><code>iosTest/kotlin</code>パスの入力を開始して選択肢を絞り込み、リストから選択します。</p></li></ol><p><img src="`+r+`" alt="iOSテストディレクトリの作成" width="350"></p><ol start="4"><li><p><code>iosTest/kotlin</code>ディレクトリに、新しい<code>org.kmp.testing</code>ディレクトリを作成します。</p></li><li><p>このディレクトリに、<code>IOSRuntimeTest.kt</code>ファイルを作成し、次のiOSテストで更新します。</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.test.Test</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.test.assertEquals</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> IOSRuntimeTest</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    @Test</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> shouldDetectOS</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> runtime </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> determineCurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        assertEquals</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(runtime.name, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;ios&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        assertEquals</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(runtime.version, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;unknown&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div></li></ol><h3 id="複数のテストを実行し、レポートを分析する" tabindex="-1">複数のテストを実行し、レポートを分析する <a class="header-anchor" href="#複数のテストを実行し、レポートを分析する" aria-label="Permalink to &quot;複数のテストを実行し、レポートを分析する&quot;">​</a></h3><p>この段階で、共通、Android、iOSの実装コードと、それらのテストが用意できました。 プロジェクトのディレクトリ構造は次のようになります。</p><p><img src="`+o+'" alt="プロジェクト全体の構造" width="300"></p><p>個々のテストはコンテキストメニューから実行することも、ショートカットを使用することもできます。もう1つのオプションは、Gradleタスクを使用することです。たとえば、<code>allTests</code> Gradleタスクを実行すると、プロジェクト内のすべてのテストが対応するテストランナーで実行されます。</p><p><img src="'+h+'" alt="Gradleテストタスク" width="700"></p><p>テストを実行すると、IDEの出力に加えて、HTMLレポートが生成されます。これらは<code>shared/build/reports/tests</code>ディレクトリにあります。</p><p><img src="'+k+'" alt="マルチプラットフォームテストのHTMLレポート" width="300"></p><p><code>allTests</code>タスクを実行し、生成されたレポートを調べます。</p><ul><li><code>allTests/index.html</code>ファイルには、共通テストとiOSテストの結合レポートが含まれています（iOSテストは共通テストに依存しており、それらの後に実行されます）。</li><li><code>testDebugUnitTest</code>と<code>testReleaseUnitTest</code>フォルダには、両方のデフォルトAndroidビルドフレーバーのレポートが含まれています。（現在、Androidテストレポートは<code>allTests</code>レポートと自動的にマージされません。）</li></ul><p><img src="'+c+'" alt="マルチプラットフォームテストのHTMLレポート" width="700"></p><h2 id="マルチプラットフォームプロジェクトでテストを使用するためのルール" tabindex="-1">マルチプラットフォームプロジェクトでテストを使用するためのルール <a class="header-anchor" href="#マルチプラットフォームプロジェクトでテストを使用するためのルール" aria-label="Permalink to &quot;マルチプラットフォームプロジェクトでテストを使用するためのルール&quot;">​</a></h2><p>これで、Kotlin Multiplatformアプリケーションでテストを作成、構成、実行できるようになりました。 今後のプロジェクトでテストを扱う際には、次の点を覚えておいてください。</p><ul><li>共通コードのテストを記述する際は、<a href="https://kotlinlang.org/api/latest/kotlin.test/" target="_blank" rel="noreferrer"><code>kotlin.test</code></a>のようなマルチプラットフォームライブラリのみを使用してください。<code>commonTest</code>ソースセットに依存関係を追加します。</li><li><code>kotlin.test</code> APIの<code>Asserter</code>型は、間接的にのみ使用する必要があります。<code>Asserter</code>インスタンスは表示されますが、テストでそれを使用する必要はありません。</li><li>常にテストライブラリのAPI内で作業してください。幸いなことに、コンパイラとIDEは、フレームワーク固有の機能の使用を防ぎます。</li><li><code>commonTest</code>でテストを実行するためにどのフレームワークを使用してもかまいませんが、開発環境が正しくセットアップされていることを確認するために、使用する予定の各フレームワークでテストを実行することをお勧めします。</li><li>物理的な違いを考慮してください。たとえば、スクロールの慣性や摩擦の値はプラットフォームやデバイスによって異なるため、同じスクロール速度を設定しても、異なるスクロール位置になる可能性があります。予期される動作を保証するために、常にターゲットプラットフォームでコンポーネントをテストしてください。</li><li>プラットフォーム固有のコードのテストを記述する際は、対応するフレームワークの機能（例: アノテーションや拡張機能）を使用できます。</li><li>テストはIDEからでもGradleタスクを使用しても実行できます。</li><li>テストを実行すると、HTMLテストレポートが自動的に生成されます。</li></ul><h2 id="次のステップ" tabindex="-1">次のステップ <a class="header-anchor" href="#次のステップ" aria-label="Permalink to &quot;次のステップ&quot;">​</a></h2><ul><li><a href="./multiplatform-discover-project">マルチプラットフォームプロジェクトの構造を理解する</a>で、マルチプラットフォームプロジェクトのレイアウトを調べてください。</li><li>Kotlinエコシステムが提供する別のマルチプラットフォームテストフレームワーク、<a href="https://kotest.io/" target="_blank" rel="noreferrer">Kotest</a>をチェックしてください。Kotestはさまざまなスタイルのテスト記述を可能にし、通常のテストを補完するアプローチをサポートしています。これには、<a href="https://kotest.io/docs/framework/datatesting/data-driven-testing.html" target="_blank" rel="noreferrer">データ駆動型</a>および<a href="https://kotest.io/docs/proptest/property-based-testing.html" target="_blank" rel="noreferrer">プロパティベース</a>のテストが含まれます。</li></ul>',45))])}const _=d(F,[["render",C]]);export{T as __pageData,_ as default};
