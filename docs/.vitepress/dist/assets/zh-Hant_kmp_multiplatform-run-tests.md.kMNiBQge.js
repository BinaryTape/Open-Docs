import{_ as l,a as e,b as r,c as o,d as h,e as k,f as c}from"./chunks/multiplatform-test-report.CawuKTkU.js";import{_ as d,C as p,c as u,o as g,j as n,G as a,ag as E,a as m,w as y}from"./chunks/framework.Bksy39di.js";const B=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/kmp/multiplatform-run-tests.md","filePath":"zh-Hant/kmp/multiplatform-run-tests.md","lastUpdated":1755516278000}'),F={name:"zh-Hant/kmp/multiplatform-run-tests.md"};function C(q,s,f,v,b,A){const i=p("secondary-label"),t=p("tldr");return g(),u("div",null,[s[1]||(s[1]=n("h1",{id:"測試您的多平台應用程式-–-教學",tabindex:"-1"},[m("測試您的多平台應用程式 – 教學 "),n("a",{class:"header-anchor",href:"#測試您的多平台應用程式-–-教學","aria-label":'Permalink to "測試您的多平台應用程式 – 教學"'},"​")],-1)),a(i,{ref:"IntelliJ IDEA"},null,512),a(i,{ref:"Android Studio"},null,512),a(t,null,{default:y(()=>s[0]||(s[0]=[n("p",null,"本教學使用 IntelliJ IDEA，但您也可以在 Android Studio 中遵循此教學 – 這兩個 IDE 共享相同的核心功能和 Kotlin Multiplatform 支援。",-1)])),_:1}),s[2]||(s[2]=E('<p>在本教學中，您將學習如何在 Kotlin Multiplatform 應用程式中建立、配置和執行測試。</p><p>多平台專案的測試可以分為兩類：</p><ul><li>通用程式碼的測試。這些測試可以使用任何支援的框架在任何平台上執行。</li><li>平台專屬程式碼的測試。這些對於測試平台專屬邏輯至關重要。它們使用平台專屬的框架，並可受益於其附加功能，例如更豐富的 API 和更廣泛的斷言。</li></ul><p>多平台專案支援這兩種類別。本教學將首先展示如何在簡單的 Kotlin Multiplatform 專案中設定、建立和執行通用程式碼的單元測試。然後，您將處理一個更複雜的範例，該範例需要通用和平台專屬程式碼的測試。</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>本教學假設您熟悉： * Kotlin Multiplatform 專案的佈局。如果不是，請在開始前完成<a href="./multiplatform-create-first-app">此教學</a>。 * 流行單元測試框架的基礎知識，例如 <a href="https://junit.org/junit5/" target="_blank" rel="noreferrer">JUnit</a>。</p></div><h2 id="測試一個簡單的多平台專案" tabindex="-1">測試一個簡單的多平台專案 <a class="header-anchor" href="#測試一個簡單的多平台專案" aria-label="Permalink to &quot;測試一個簡單的多平台專案&quot;">​</a></h2><h3 id="建立專案" tabindex="-1">建立專案 <a class="header-anchor" href="#建立專案" aria-label="Permalink to &quot;建立專案&quot;">​</a></h3><ol><li><p>在<a href="./quickstart">快速入門</a>中，完成<a href="./quickstart#set-up-the-environment">設定 Kotlin Multiplatform 開發環境</a>的說明。</p></li><li><p>在 IntelliJ IDEA 中，選擇 <strong>File</strong> | <strong>New</strong> | <strong>Project</strong>。</p></li><li><p>在左側面板中，選擇 <strong>Kotlin Multiplatform</strong>。</p></li><li><p>在 <strong>New Project</strong> 視窗中指定以下欄位：</p><ul><li><strong>Name</strong>: KotlinProject</li><li><strong>Group</strong>: kmp.project.demo</li><li><strong>Artifact</strong>: kotlinproject</li><li><strong>JDK</strong>: Amazon Corretto version 17<div class="note custom-block"><p class="custom-block-title">NOTE</p><p>這個 JDK 版本是為了讓您稍後新增的一個測試能夠成功執行所必需的。</p></div></li></ul></li><li><p>選擇 <strong>Android</strong> 目標。</p><ul><li>如果您使用的是 Mac，也請選擇 <strong>iOS</strong>。確保已選擇 <strong>Do not share UI</strong> 選項。</li></ul></li><li><p>取消選擇 <strong>Include tests</strong> 並點擊 <strong>Create</strong>。</p></li></ol><p><img src="'+l+`" alt="Create simple multiplatform project" width="800"></p><h3 id="編寫程式碼" tabindex="-1">編寫程式碼 <a class="header-anchor" href="#編寫程式碼" aria-label="Permalink to &quot;編寫程式碼&quot;">​</a></h3><p>在 <code>shared/src/commonMain/kotlin</code> 目錄中，建立一個新的 <code>common.example.search</code> 目錄。 在此目錄中，建立一個 Kotlin 檔案 <code>Grep.kt</code>，其中包含以下函數：</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> grep</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(lines: </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">List</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;, pattern: </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, action: (</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) -&gt; </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Unit</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> regex </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> pattern.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">toRegex</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    lines.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">filter</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(regex::</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">containsMatchIn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">forEach</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(action)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>此函數旨在模仿 <a href="https://en.wikipedia.org/wiki/Grep" target="_blank" rel="noreferrer">UNIX <code>grep</code> 命令</a>。這裡，該函數接收多行文字、一個用作正規表達式的模式，以及一個每當某行符合該模式時都會被調用的函數。</p><h3 id="新增測試" tabindex="-1">新增測試 <a class="header-anchor" href="#新增測試" aria-label="Permalink to &quot;新增測試&quot;">​</a></h3><p>現在，讓我們測試通用程式碼。其中一個重要部分將是通用測試的來源集，它將 <a href="https://kotlinlang.org/api/latest/kotlin.test/" target="_blank" rel="noreferrer"><code>kotlin.test</code></a> API 函式庫作為依賴項。</p><ol><li><p>在 <code>shared/build.gradle.kts</code> 檔案中，檢查是否存在對 <code>kotlin.test</code> 函式庫的依賴：</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"></span></code></pre></div></li></ol><p>sourceSets { //... commonTest.dependencies { implementation(libs.kotlin.test) } }</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>2.  \`commonTest\` 來源集儲存所有通用測試。您需要在專案中建立一個同名目錄：</span></span>
<span class="line"><span></span></span>
<span class="line"><span> 1.  右鍵點擊 \`shared/src\` 目錄，然後選擇 **New | Directory**。IDE 將顯示一個選項列表。</span></span>
<span class="line"><span> 2.  開始輸入 \`commonTest/kotlin\` 路徑以縮小選擇範圍，然後從列表中選擇它：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   ![Creating common test directory](create-common-test-dir.png){width=350}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3.  在 \`commonTest/kotlin\` 目錄中，建立一個新的 \`common.example.search\` 軟體包。</span></span>
<span class="line"><span>4.  在此軟體包中，建立 \`Grep.kt\` 檔案並使用以下單元測試更新它：</span></span>
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
<span class="line"><span>如您所見，匯入的註解和斷言既不是平台專屬的，也不是框架專屬的。當您稍後執行此測試時，平台專屬的框架將提供測試執行器。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### 探索 \`kotlin.test\` API {initial-collapse-state=&quot;collapsed&quot; collapsible=&quot;true&quot;}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[\`kotlin.test\`](https://kotlinlang.org/api/latest/kotlin.test/) 函式庫提供與平台無關的註解和斷言，供您在測試中使用。諸如 \`Test\` 之類的註解，會對應到所選框架提供的註解或其最接近的等效項。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>斷言透過 [\`Asserter\` 介面](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-asserter/) 的實作來執行。此介面定義了測試中通常執行的不同檢查。該 API 有一個預設實作，但通常您會使用特定於框架的實作。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>例如，JUnit 4、JUnit 5 和 TestNG 框架都在 JVM 上受支援。在 Android 上，呼叫 \`assertEquals()\` 可能會導致呼叫 \`asserter.assertEquals()\`，其中 \`asserter\` 物件是 \`JUnit4Asserter\` 的實例。在 iOS 上，\`Asserter\` 類型的預設實作與 Kotlin/Native 測試執行器結合使用。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 執行測試</span></span>
<span class="line"><span></span></span>
<span class="line"><span>您可以透過執行以下方式來執行測試：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>*   使用邊緣（gutter）中的 **Run** 圖示執行 \`shouldFindMatches()\` 測試函數。</span></span>
<span class="line"><span>*   使用其上下文選單執行測試檔案。</span></span>
<span class="line"><span>*   使用邊緣中的 **Run** 圖示執行 \`GrepTest\` 測試類別。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>還有一個方便的 &lt;shortcut&gt;⌃ ⇧ F10&lt;/shortcut&gt;/&lt;shortcut&gt;Ctrl+Shift+F10&lt;/shortcut&gt; 快捷鍵。無論您選擇哪種選項，您都會看到一個要執行測試的目標列表：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![Run test task](run-test-tasks.png){width=300}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>對於 \`android\` 選項，測試使用 JUnit 4 執行。對於 \`iosSimulatorArm64\`，Kotlin 編譯器會檢測測試註解並建立一個 _測試二進位檔_，該二進位檔由 Kotlin/Native 自己的測試執行器執行。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>以下是成功測試執行所產生的輸出範例：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![Test output](run-test-results.png){width=700}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 使用更複雜的專案</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 為通用程式碼編寫測試</span></span>
<span class="line"><span></span></span>
<span class="line"><span>您已經為使用 \`grep()\` 函數的通用程式碼建立了一個測試。現在，讓我們考慮一個使用 \`CurrentRuntime\` 類別的更進階通用程式碼測試。此類別包含程式碼執行的平台的詳細資訊。例如，對於在本地 JVM 上執行的 Android 單元測試，它可能具有 &quot;OpenJDK&quot; 和 &quot;17.0&quot; 的值。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>應使用平台的名稱和版本字串建立 \`CurrentRuntime\` 的實例，其中版本是可選的。當版本存在時，如果可用，您只需要字串開頭的數字。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1.  在 \`commonMain/kotlin\` 目錄中，建立一個新的 \`org.kmp.testing\` 目錄。</span></span>
<span class="line"><span>2.  在此目錄中，建立 \`CurrentRuntime.kt\` 檔案並使用以下實作更新它：</span></span>
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
<span class="line"><span>3.  在 \`commonTest/kotlin\` 目錄中，建立一個新的 \`org.kmp.testing\` 軟體包。</span></span>
<span class="line"><span>4.  在此軟體包中，建立 \`CurrentRuntimeTest.kt\` 檔案並使用以下與平台和框架無關的測試更新它：</span></span>
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
<span class="line"><span>您可以使用 [IDE 中可用](#run-tests) 的任何方式執行此測試。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 新增平台專屬測試</span></span>
<span class="line"><span></span></span>
<span class="line"><span>::: note</span></span>
<span class="line"><span>為了簡潔和簡化，此處使用了[預期和實際宣告的機制](multiplatform-connect-to-apis.md)。在更複雜的程式碼中，更好的方法是使用介面和工廠函數。</span></span>
<span class="line"><span>:::</span></span>
<span class="line"><span>現在您已經有編寫通用程式碼測試的經驗，讓我們探索為 Android 和 iOS 編寫平台專屬測試。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>若要建立 \`CurrentRuntime\` 的實例，請在通用 \`CurrentRuntime.kt\` 檔案中宣告一個函數，如下所示：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`kotlin</span></span>
<span class="line"><span>expect fun determineCurrentRuntime(): CurrentRuntime</span></span></code></pre></div><p>該函數應對每個受支援的平台都有單獨的實作。否則，建置將失敗。除了在每個平台上實作此函數之外，您還應提供測試。讓我們為 Android 和 iOS 建立它們。</p><h4 id="對於-android" tabindex="-1">對於 Android <a class="header-anchor" href="#對於-android" aria-label="Permalink to &quot;對於 Android&quot;">​</a></h4><ol><li><p>在 <code>androidMain/kotlin</code> 目錄中，建立一個新的 <code>org.kmp.testing</code> 軟體包。</p></li><li><p>在此軟體包中，建立 <code>AndroidRuntime.kt</code> 檔案並使用預期的 <code>determineCurrentRuntime()</code> 函數的實際實作更新它：</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">actual </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> determineCurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(): </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">CurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> name </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> System.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getProperty</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;java.vm.name&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) ?: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Android&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> version </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> System.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getProperty</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;java.version&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> CurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(name, version)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div></li><li><p>在 <code>shared/src</code> 目錄內建立一個測試目錄：</p></li><li><p>右鍵點擊 <code>shared/src</code> 目錄，然後選擇 <strong>New | Directory</strong>。IDE 將顯示一個選項列表。</p></li><li><p>開始輸入 <code>androidUnitTest/kotlin</code> 路徑以縮小選擇範圍，然後從列表中選擇它：</p></li></ol><p><img src="`+e+`" alt="Creating Android test directory" width="350"></p><ol start="4"><li><p>在 <code>kotlin</code> 目錄中，建立一個新的 <code>org.kmp.testing</code> 軟體包。</p></li><li><p>在此軟體包中，建立 <code>AndroidRuntimeTest.kt</code> 檔案並使用以下 Android 測試更新它：</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.test.Test</span></span>
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
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div></li></ol><div class="note custom-block"><p class="custom-block-title">NOTE</p><p>如果您在教學開始時選擇了不同的 JDK 版本，您可能需要更改 <code>name</code> 和 <code>version</code>，以便測試能夠成功執行。</p></div><p>Android 專屬測試在本地 JVM 上執行可能看起來很奇怪。這是因為這些測試作為本地單元測試在當前機器上執行。正如 <a href="https://developer.android.com/studio/test/test-in-android-studio" target="_blank" rel="noreferrer">Android Studio 文件</a>中所述，這些測試與在設備或模擬器上運行的儀器化測試不同。</p><p>您可以向您的專案新增其他類型的測試。要了解儀器化測試，請參閱此 <a href="https://touchlab.co/understanding-and-configuring-your-kmm-test-suite/" target="_blank" rel="noreferrer">Touchlab 指南</a>。</p><h4 id="對於-ios" tabindex="-1">對於 iOS <a class="header-anchor" href="#對於-ios" aria-label="Permalink to &quot;對於 iOS&quot;">​</a></h4><ol><li><p>在 <code>iosMain/kotlin</code> 目錄中，建立一個新的 <code>org.kmp.testing</code> 目錄。</p></li><li><p>在此目錄中，建立 <code>IOSRuntime.kt</code> 檔案並使用預期的 <code>determineCurrentRuntime()</code> 函數的實際實作更新它：</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.experimental.ExperimentalNativeApi</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.native.Platform</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">@OptIn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(ExperimentalNativeApi::</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">actual </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> determineCurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(): </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">CurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> name </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Platform.osFamily.name.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">lowercase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> CurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(name, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div></li><li><p>在 <code>shared/src</code> 目錄中建立一個新目錄：</p></li><li><p>右鍵點擊 <code>shared/src</code> 目錄，然後選擇 <strong>New | Directory</strong>。IDE 將顯示一個選項列表。</p></li><li><p>開始輸入 <code>iosTest/kotlin</code> 路徑以縮小選擇範圍，然後從列表中選擇它：</p></li></ol><p><img src="`+r+`" alt="Creating iOS test directory" width="350"></p><ol start="4"><li><p>在 <code>iosTest/kotlin</code> 目錄中，建立一個新的 <code>org.kmp.testing</code> 目錄。</p></li><li><p>在此目錄中，建立 <code>IOSRuntimeTest.kt</code> 檔案並使用以下 iOS 測試更新它：</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.test.Test</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.test.assertEquals</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> IOSRuntimeTest</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    @Test</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> shouldDetectOS</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> runtime </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> determineCurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        assertEquals</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(runtime.name, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;ios&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        assertEquals</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(runtime.version, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;unknown&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div></li></ol><h3 id="執行多個測試並分析報告" tabindex="-1">執行多個測試並分析報告 <a class="header-anchor" href="#執行多個測試並分析報告" aria-label="Permalink to &quot;執行多個測試並分析報告&quot;">​</a></h3><p>在此階段，您已擁有通用、Android 和 iOS 實作的程式碼，以及它們的測試。您的專案目錄結構應如下所示：</p><p><img src="`+o+'" alt="Whole project structure" width="300"></p><p>您可以從上下文選單執行個別測試或使用快捷鍵。另一個選項是使用 Gradle 任務。例如，如果您執行 <code>allTests</code> Gradle 任務，專案中的每個測試都將與相應的測試執行器一起執行：</p><p><img src="'+h+'" alt="Gradle test tasks" width="700"></p><p>當您執行測試時，除了 IDE 中的輸出之外，還會產生 HTML 報告。您可以在 <code>shared/build/reports/tests</code> 目錄中找到它們：</p><p><img src="'+k+'" alt="HTML reports for multiplatform tests" width="300"></p><p>執行 <code>allTests</code> 任務並檢查它產生的報告：</p><ul><li><code>allTests/index.html</code> 檔案包含通用測試和 iOS 測試的合併報告（iOS 測試依賴於通用測試，並在通用測試之後執行）。</li><li><code>testDebugUnitTest</code> 和 <code>testReleaseUnitTest</code> 資料夾包含兩種預設 Android 建置變體（build flavors）的報告。（目前，Android 測試報告不會自動與 <code>allTests</code> 報告合併。）</li></ul><p><img src="'+c+'" alt="HTML report for multiplatform tests" width="700"></p><h2 id="在多平台專案中使用測試的規則" tabindex="-1">在多平台專案中使用測試的規則 <a class="header-anchor" href="#在多平台專案中使用測試的規則" aria-label="Permalink to &quot;在多平台專案中使用測試的規則&quot;">​</a></h2><p>您現在已經在 Kotlin Multiplatform 應用程式中建立、配置和執行了測試。 在您未來的專案中使用測試時，請記住：</p><ul><li>為通用程式碼編寫測試時，僅使用多平台函式庫，例如 <a href="https://kotlinlang.org/api/latest/kotlin.test/" target="_blank" rel="noreferrer"><code>kotlin.test</code></a>。將依賴項新增到 <code>commonTest</code> 來源集。</li><li>來自 <code>kotlin.test</code> API 的 <code>Asserter</code> 類型應僅間接使用。儘管 <code>Asserter</code> 實例是可見的，但您不需要在測試中使用它。</li><li>始終保持在測試函式庫 API 範圍內。幸運的是，編譯器和 IDE 會阻止您使用框架專屬的功能。</li><li>儘管在 <code>commonTest</code> 中使用哪個框架來執行測試並不重要，但最好使用您打算使用的每個框架來執行測試，以檢查您的開發環境是否已正確設定。</li><li>考慮物理差異。例如，滾動慣性 (scrolling inertia) 和摩擦力 (friction) 值因平台和設備而異，因此設定相同的滾動速度可能會導致不同的滾動位置。務必在目標平台上測試您的組件，以確保預期的行為。</li><li>為平台專屬程式碼編寫測試時，您可以使用相應框架的功能，例如註解和擴充。</li><li>您可以從 IDE 和使用 Gradle 任務執行測試。</li><li>當您執行測試時，HTML 測試報告會自動產生。</li></ul><h2 id="接下來是什麼" tabindex="-1">接下來是什麼？ <a class="header-anchor" href="#接下來是什麼" aria-label="Permalink to &quot;接下來是什麼？&quot;">​</a></h2><ul><li>在<a href="./multiplatform-discover-project">了解多平台專案結構</a>中探索多平台專案的佈局。</li><li>查看 <a href="https://kotest.io/" target="_blank" rel="noreferrer">Kotest</a>，這是 Kotlin 生態系統提供的另一個多平台測試框架。Kotest 允許以多種風格編寫測試，並支援對常規測試的補充方法。這些包括<a href="https://kotest.io/docs/framework/datatesting/data-driven-testing.html" target="_blank" rel="noreferrer">資料驅動</a>和<a href="https://kotest.io/docs/proptest/property-based-testing.html" target="_blank" rel="noreferrer">屬性驅動</a>測試。</li></ul>',45))])}const _=d(F,[["render",C]]);export{B as __pageData,_ as default};
