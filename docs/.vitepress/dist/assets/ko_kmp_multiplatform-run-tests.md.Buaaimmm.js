import{_ as l,a as e,b as r,c as o,d as h,e as k,f as c}from"./chunks/multiplatform-test-report.CawuKTkU.js";import{_ as d,C as p,c as u,o as g,j as n,G as a,ag as E,a as m,w as y}from"./chunks/framework.Bksy39di.js";const B=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/kmp/multiplatform-run-tests.md","filePath":"ko/kmp/multiplatform-run-tests.md","lastUpdated":1755516278000}'),F={name:"ko/kmp/multiplatform-run-tests.md"};function C(q,s,v,f,b,A){const i=p("secondary-label"),t=p("tldr");return g(),u("div",null,[s[1]||(s[1]=n("h1",{id:"멀티플랫폼-앱-테스트-−-튜토리얼",tabindex:"-1"},[m("멀티플랫폼 앱 테스트 − 튜토리얼 "),n("a",{class:"header-anchor",href:"#멀티플랫폼-앱-테스트-−-튜토리얼","aria-label":'Permalink to "멀티플랫폼 앱 테스트 − 튜토리얼"'},"​")],-1)),a(i,{ref:"IntelliJ IDEA"},null,512),a(i,{ref:"Android Studio"},null,512),a(t,null,{default:y(()=>s[0]||(s[0]=[n("p",null,"이 튜토리얼은 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE는 동일한 핵심 기능과 Kotlin Multiplatform 지원을 공유합니다.",-1)])),_:1}),s[2]||(s[2]=E('<p>이 튜토리얼에서는 Kotlin Multiplatform 애플리케이션에서 테스트를 생성, 구성 및 실행하는 방법을 배웁니다.</p><p>멀티플랫폼 프로젝트를 위한 테스트는 크게 두 가지 범주로 나눌 수 있습니다:</p><ul><li><strong>공용 코드 테스트.</strong> 이 테스트는 지원되는 모든 프레임워크를 사용하여 모든 플랫폼에서 실행할 수 있습니다.</li><li><strong>플랫폼별 코드 테스트.</strong> 플랫폼별 로직을 테스트하는 데 필수적입니다. 이 테스트는 플랫폼별 프레임워크를 사용하며, 더 풍부한 API와 더 넓은 범위의 어설션과 같은 추가 기능을 활용할 수 있습니다.</li></ul><p>두 가지 범주 모두 멀티플랫폼 프로젝트에서 지원됩니다. 이 튜토리얼에서는 먼저 간단한 Kotlin Multiplatform 프로젝트에서 공용 코드에 대한 단위 테스트를 설정, 생성 및 실행하는 방법을 보여줍니다. 그런 다음, 공용 및 플랫폼별 코드 모두에 대한 테스트가 필요한 더 복잡한 예제를 다룰 것입니다.</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>이 튜토리얼은 다음 내용에 익숙하다고 가정합니다: * Kotlin Multiplatform 프로젝트의 레이아웃. 익숙하지 않다면, 시작하기 전에 <a href="./multiplatform-create-first-app">이 튜토리얼</a>을 완료하십시오. * <a href="https://junit.org/junit5/" target="_blank" rel="noreferrer">JUnit</a>과 같은 인기 있는 단위 테스트 프레임워크의 기초.</p></div><h2 id="간단한-멀티플랫폼-프로젝트-테스트" tabindex="-1">간단한 멀티플랫폼 프로젝트 테스트 <a class="header-anchor" href="#간단한-멀티플랫폼-프로젝트-테스트" aria-label="Permalink to &quot;간단한 멀티플랫폼 프로젝트 테스트&quot;">​</a></h2><h3 id="프로젝트-생성" tabindex="-1">프로젝트 생성 <a class="header-anchor" href="#프로젝트-생성" aria-label="Permalink to &quot;프로젝트 생성&quot;">​</a></h3><ol><li><p><a href="./quickstart">빠른 시작</a>에서 <a href="./quickstart#set-up-the-environment">Kotlin Multiplatform 개발 환경 설정</a> 지침을 완료합니다.</p></li><li><p>IntelliJ IDEA에서 <strong>File</strong> | <strong>New</strong> | <strong>Project</strong>를 선택합니다.</p></li><li><p>왼쪽 패널에서 <strong>Kotlin Multiplatform</strong>를 선택합니다.</p></li><li><p><strong>New Project</strong> 창에서 다음 필드를 지정합니다:</p><ul><li><strong>Name</strong>: KotlinProject</li><li><strong>Group</strong>: kmp.project.demo</li><li><strong>Artifact</strong>: kotlinproject</li><li><strong>JDK</strong>: Amazon Corretto version 17<div class="note custom-block"><p class="custom-block-title">NOTE</p><p>이 JDK 버전은 나중에 추가할 테스트 중 하나가 성공적으로 실행되는 데 필요합니다.</p></div></li></ul></li><li><p><strong>Android</strong> 타겟을 선택합니다.</p><ul><li>Mac을 사용하는 경우, <strong>iOS</strong>도 선택합니다. <strong>Do not share UI</strong> 옵션이 선택되어 있는지 확인합니다.</li></ul></li><li><p><strong>Include tests</strong>를 선택 해제하고 <strong>Create</strong>를 클릭합니다.</p></li></ol><p><img src="'+l+`" alt="Create simple multiplatform project" width="800"></p><h3 id="코드-작성" tabindex="-1">코드 작성 <a class="header-anchor" href="#코드-작성" aria-label="Permalink to &quot;코드 작성&quot;">​</a></h3><p><code>shared/src/commonMain/kotlin</code> 디렉토리에 새 <code>common.example.search</code> 디렉토리를 생성합니다. 이 디렉토리에 다음 함수가 포함된 Kotlin 파일 <code>Grep.kt</code>를 생성합니다:</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> grep</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(lines: </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">List</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;, pattern: </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, action: (</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) -&gt; </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Unit</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> regex </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> pattern.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">toRegex</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    lines.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">filter</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(regex::</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">containsMatchIn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">forEach</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(action)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>이 함수는 <a href="https://en.wikipedia.org/wiki/Grep" target="_blank" rel="noreferrer">UNIX <code>grep</code> 명령</a>과 유사하게 설계되었습니다. 여기서 함수는 텍스트 줄, 정규 표현식으로 사용되는 패턴, 그리고 줄이 패턴과 일치할 때마다 호출되는 함수를 인수로 받습니다.</p><h3 id="테스트-추가" tabindex="-1">테스트 추가 <a class="header-anchor" href="#테스트-추가" aria-label="Permalink to &quot;테스트 추가&quot;">​</a></h3><p>이제 공용 코드를 테스트해 봅시다. 필수적인 부분은 <code>kotlin.test</code> API 라이브러리를 종속성으로 가지는 공용 테스트용 소스 세트가 될 것입니다.</p><ol><li><p><code>shared/build.gradle.kts</code> 파일에서 <code>kotlin.test</code> 라이브러리에 대한 종속성이 있는지 확인합니다:</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"></span></code></pre></div></li></ol><p>sourceSets { //... commonTest.dependencies { implementation(libs.kotlin.test) } }</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>2.  \`commonTest\` 소스 세트는 모든 공용 테스트를 저장합니다. 프로젝트에 동일한 이름의 디렉토리를 생성해야 합니다:</span></span>
<span class="line"><span></span></span>
<span class="line"><span> 1.  \`shared/src\` 디렉토리를 마우스 오른쪽 버튼으로 클릭하고 **New | Directory**를 선택합니다. IDE에 옵션 목록이 표시됩니다.</span></span>
<span class="line"><span> 2.  선택 범위를 좁히기 위해 \`commonTest/kotlin\` 경로를 입력하기 시작한 다음 목록에서 선택합니다:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   ![Creating common test directory](create-common-test-dir.png){width=350}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3.  \`commonTest/kotlin\` 디렉토리에 새 \`common.example.search\` 패키지를 생성합니다.</span></span>
<span class="line"><span>4.  이 패키지에 \`Grep.kt\` 파일을 생성하고 다음 단위 테스트로 업데이트합니다:</span></span>
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
<span class="line"><span>보시다시피, 임포트된 어노테이션과 어설션은 플랫폼이나 프레임워크에 종속적이지 않습니다.</span></span>
<span class="line"><span>나중에 이 테스트를 실행하면, 플랫폼별 프레임워크가 테스트 러너를 제공할 것입니다.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### \`kotlin.test\` API 살펴보기 {initial-collapse-state=&quot;collapsed&quot; collapsible=&quot;true&quot;}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[\`kotlin.test\`](https://kotlinlang.org/api/latest/kotlin.test/) 라이브러리는 테스트에서 사용할 수 있는 플랫폼 독립적인 어노테이션과 어설션을 제공합니다. \`Test\`와 같은 어노테이션은 선택된 프레임워크에서 제공하는 어노테이션이나 그에 가장 가까운 동등한 어노테이션에 매핑됩니다.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>어설션은 [\`Asserter\` 인터페이스](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-asserter/)의 구현을 통해 실행됩니다.</span></span>
<span class="line"><span>이 인터페이스는 테스트에서 일반적으로 수행되는 다양한 검사를 정의합니다. API에는 기본 구현이 있지만, 일반적으로 프레임워크별 구현을 사용하게 됩니다.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>예를 들어, JUnit 4, JUnit 5, TestNG 프레임워크는 모두 JVM에서 지원됩니다. Android에서는 \`assertEquals()\` 호출이 \`asserter.assertEquals()\` 호출로 이어질 수 있으며, 여기서 \`asserter\` 객체는 \`JUnit4Asserter\`의 인스턴스입니다. iOS에서는 \`Asserter\` 유형의 기본 구현이 Kotlin/Native 테스트 러너와 함께 사용됩니다.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 테스트 실행</span></span>
<span class="line"><span></span></span>
<span class="line"><span>다음과 같은 방법으로 테스트를 실행할 수 있습니다:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>*   거터의 **Run** 아이콘을 사용하여 \`shouldFindMatches()\` 테스트 함수 실행.</span></span>
<span class="line"><span>*   컨텍스트 메뉴를 사용하여 테스트 파일 실행.</span></span>
<span class="line"><span>*   거터의 **Run** 아이콘을 사용하여 \`GrepTest\` 테스트 클래스 실행.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>또한 편리한 &lt;shortcut&gt;⌃ ⇧ F10&lt;/shortcut&gt;/&lt;shortcut&gt;Ctrl+Shift+F10&lt;/shortcut&gt; 단축키도 있습니다.</span></span>
<span class="line"><span>어떤 옵션을 선택하든, 테스트를 실행할 대상 목록이 표시됩니다:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![Run test task](run-test-tasks.png){width=300}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`android\` 옵션의 경우, 테스트는 JUnit 4를 사용하여 실행됩니다. \`iosSimulatorArm64\`의 경우, Kotlin 컴파일러가 테스트 어노테이션을 감지하고 Kotlin/Native 자체 테스트 러너에 의해 실행되는 _테스트 바이너리_를 생성합니다.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>성공적인 테스트 실행으로 생성된 출력의 예는 다음과 같습니다:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![Test output](run-test-results.png){width=700}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 더 복잡한 프로젝트 작업</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 공용 코드 테스트 작성</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`grep()\` 함수를 사용하여 공용 코드에 대한 테스트를 이미 생성했습니다. 이제 \`CurrentRuntime\` 클래스를 사용한 더 고급 공용 코드 테스트를 고려해 봅시다. 이 클래스에는 코드가 실행되는 플랫폼의 세부 정보가 포함됩니다. 예를 들어, 로컬 JVM에서 실행되는 Android 단위 테스트의 경우 &quot;OpenJDK&quot; 및 &quot;17.0&quot; 값을 가질 수 있습니다.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`CurrentRuntime\` 인스턴스는 플랫폼의 이름과 버전(버전은 선택 사항)을 문자열로 사용하여 생성되어야 합니다. 버전이 존재할 때, 문자열 시작 부분에 숫자가 있다면 그 숫자만 필요합니다.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1.  \`commonMain/kotlin\` 디렉토리에 새 \`org.kmp.testing\` 디렉토리를 생성합니다.</span></span>
<span class="line"><span>2.  이 디렉토리에 \`CurrentRuntime.kt\` 파일을 생성하고 다음 구현으로 업데이트합니다:</span></span>
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
<span class="line"><span>3.  \`commonTest/kotlin\` 디렉토리에 새 \`org.kmp.testing\` 패키지를 생성합니다.</span></span>
<span class="line"><span>4.  이 패키지에 \`CurrentRuntimeTest.kt\` 파일을 생성하고 다음 플랫폼 및 프레임워크 독립적인 테스트로 업데이트합니다:</span></span>
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
<span class="line"><span>이 테스트는 [IDE에서 사용 가능한](#run-tests) 모든 방법을 사용하여 실행할 수 있습니다.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 플랫폼별 테스트 추가</span></span>
<span class="line"><span></span></span>
<span class="line"><span>::: note</span></span>
<span class="line"><span>여기서는 간결함과 단순함을 위해 [expected와 actual 선언의 메커니즘](multiplatform-connect-to-apis.md)이 사용됩니다. 더 복잡한 코드에서는 인터페이스와 팩토리 함수를 사용하는 것이 더 나은 접근 방식입니다.</span></span>
<span class="line"><span>:::</span></span>
<span class="line"><span>이제 공용 코드 테스트를 작성하는 경험이 있으니, Android와 iOS를 위한 플랫폼별 테스트를 작성하는 방법을 살펴보겠습니다.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`CurrentRuntime\` 인스턴스를 생성하기 위해, 공용 \`CurrentRuntime.kt\` 파일에 다음과 같이 함수를 선언합니다:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`kotlin</span></span>
<span class="line"><span>expect fun determineCurrentRuntime(): CurrentRuntime</span></span></code></pre></div><p>이 함수는 지원되는 각 플랫폼에 대해 별도의 구현을 가져야 합니다. 그렇지 않으면 빌드가 실패합니다. 각 플랫폼에서 이 함수를 구현하는 것 외에도, 테스트를 제공해야 합니다. Android와 iOS용으로 테스트를 만들어 봅시다.</p><h4 id="android용" tabindex="-1">Android용 <a class="header-anchor" href="#android용" aria-label="Permalink to &quot;Android용&quot;">​</a></h4><ol><li><p><code>androidMain/kotlin</code> 디렉토리에 새 <code>org.kmp.testing</code> 패키지를 생성합니다.</p></li><li><p>이 패키지에 <code>AndroidRuntime.kt</code> 파일을 생성하고 예상되는 <code>determineCurrentRuntime()</code> 함수의 실제 구현으로 업데이트합니다:</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">actual </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> determineCurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(): </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">CurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> name </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> System.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getProperty</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;java.vm.name&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) ?: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Android&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> version </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> System.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getProperty</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;java.version&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> CurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(name, version)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div></li><li><p><code>shared/src</code> 디렉토리 내에 테스트용 디렉토리를 생성합니다:</p></li><li><p><code>shared/src</code> 디렉토리를 마우스 오른쪽 버튼으로 클릭하고 <strong>New | Directory</strong>를 선택합니다. IDE에 옵션 목록이 표시됩니다.</p></li><li><p>선택 범위를 좁히기 위해 <code>androidUnitTest/kotlin</code> 경로를 입력하기 시작한 다음 목록에서 선택합니다:</p></li></ol><p><img src="`+e+`" alt="Creating Android test directory" width="350"></p><ol start="4"><li><p><code>kotlin</code> 디렉토리에 새 <code>org.kmp.testing</code> 패키지를 생성합니다.</p></li><li><p>이 패키지에 <code>AndroidRuntimeTest.kt</code> 파일을 생성하고 다음 Android 테스트로 업데이트합니다:</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.test.Test</span></span>
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
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div></li></ol><div class="note custom-block"><p class="custom-block-title">NOTE</p><p>튜토리얼 초반에 다른 JDK 버전을 선택했다면, 테스트가 성공적으로 실행되도록 <code>name</code>과 <code>version</code>을 변경해야 할 수 있습니다.</p></div><p>Android 특정 테스트가 로컬 JVM에서 실행되는 것이 이상하게 보일 수 있습니다. 이는 이러한 테스트가 현재 머신에서 로컬 단위 테스트로 실행되기 때문입니다. <a href="https://developer.android.com/studio/test/test-in-android-studio" target="_blank" rel="noreferrer">Android Studio 문서</a>에 설명된 대로, 이러한 테스트는 기기나 에뮬레이터에서 실행되는 계측 테스트와는 다릅니다.</p><p>프로젝트에 다른 유형의 테스트를 추가할 수 있습니다. 계측 테스트에 대해 알아보려면 <a href="https://touchlab.co/understanding-and-configuring-your-kmm-test-suite/" target="_blank" rel="noreferrer">Touchlab 가이드</a>를 참조하십시오.</p><h4 id="ios용" tabindex="-1">iOS용 <a class="header-anchor" href="#ios용" aria-label="Permalink to &quot;iOS용&quot;">​</a></h4><ol><li><p><code>iosMain/kotlin</code> 디렉토리에 새 <code>org.kmp.testing</code> 디렉토리를 생성합니다.</p></li><li><p>이 디렉토리에 <code>IOSRuntime.kt</code> 파일을 생성하고 예상되는 <code>determineCurrentRuntime()</code> 함수의 실제 구현으로 업데이트합니다:</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.experimental.ExperimentalNativeApi</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.native.Platform</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">@OptIn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(ExperimentalNativeApi::</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">actual </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> determineCurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(): </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">CurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> name </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Platform.osFamily.name.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">lowercase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> CurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(name, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div></li><li><p><code>shared/src</code> 디렉토리에 새 디렉토리를 생성합니다:</p></li><li><p><code>shared/src</code> 디렉토리를 마우스 오른쪽 버튼으로 클릭하고 <strong>New | Directory</strong>를 선택합니다. IDE에 옵션 목록이 표시됩니다.</p></li><li><p>선택 범위를 좁히기 위해 <code>iosTest/kotlin</code> 경로를 입력하기 시작한 다음 목록에서 선택합니다:</p></li></ol><p><img src="`+r+`" alt="Creating iOS test directory" width="350"></p><ol start="4"><li><p><code>iosTest/kotlin</code> 디렉토리에 새 <code>org.kmp.testing</code> 디렉토리를 생성합니다.</p></li><li><p>이 디렉토리에 <code>IOSRuntimeTest.kt</code> 파일을 생성하고 다음 iOS 테스트로 업데이트합니다:</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.test.Test</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.test.assertEquals</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> IOSRuntimeTest</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    @Test</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> shouldDetectOS</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> runtime </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> determineCurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        assertEquals</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(runtime.name, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;ios&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        assertEquals</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(runtime.version, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;unknown&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div></li></ol><h3 id="여러-테스트-실행-및-보고서-분석" tabindex="-1">여러 테스트 실행 및 보고서 분석 <a class="header-anchor" href="#여러-테스트-실행-및-보고서-분석" aria-label="Permalink to &quot;여러 테스트 실행 및 보고서 분석&quot;">​</a></h3><p>이 단계에서는 공용, Android, iOS 구현 및 해당 테스트 코드를 모두 가지고 있습니다. 프로젝트의 디렉토리 구조는 다음과 같을 것입니다:</p><p><img src="`+o+'" alt="Whole project structure" width="300"></p><p>컨텍스트 메뉴를 사용하거나 단축키를 사용하여 개별 테스트를 실행할 수 있습니다. 또 다른 옵션은 Gradle 작업을 사용하는 것입니다. 예를 들어, <code>allTests</code> Gradle 작업을 실행하면 프로젝트의 모든 테스트가 해당 테스트 러너와 함께 실행됩니다:</p><p><img src="'+h+'" alt="Gradle test tasks" width="700"></p><p>테스트를 실행하면 IDE의 출력 외에도 HTML 보고서가 생성됩니다. 이 보고서는 <code>shared/build/reports/tests</code> 디렉토리에서 찾을 수 있습니다:</p><p><img src="'+k+'" alt="HTML reports for multiplatform tests" width="300"></p><p><code>allTests</code> 작업을 실행하고 생성된 보고서를 검토합니다:</p><ul><li><code>allTests/index.html</code> 파일에는 공용 및 iOS 테스트에 대한 결합된 보고서가 포함되어 있습니다 (iOS 테스트는 공용 테스트에 종속되며, 공용 테스트 실행 후에 실행됩니다).</li><li><code>testDebugUnitTest</code> 및 <code>testReleaseUnitTest</code> 폴더에는 기본 Android 빌드 플레이버(flavor) 모두에 대한 보고서가 포함되어 있습니다. (현재 Android 테스트 보고서는 <code>allTests</code> 보고서와 자동으로 병합되지 않습니다.)</li></ul><p><img src="'+c+'" alt="HTML report for multiplatform tests" width="700"></p><h2 id="멀티플랫폼-프로젝트에서-테스트-사용-규칙" tabindex="-1">멀티플랫폼 프로젝트에서 테스트 사용 규칙 <a class="header-anchor" href="#멀티플랫폼-프로젝트에서-테스트-사용-규칙" aria-label="Permalink to &quot;멀티플랫폼 프로젝트에서 테스트 사용 규칙&quot;">​</a></h2><p>이제 Kotlin Multiplatform 애플리케이션에서 테스트를 생성, 구성 및 실행했습니다. 향후 프로젝트에서 테스트를 사용할 때 다음 사항을 기억하십시오:</p><ul><li>공용 코드에 대한 테스트를 작성할 때는 <a href="https://kotlinlang.org/api/latest/kotlin.test/" target="_blank" rel="noreferrer">kotlin.test</a>와 같은 멀티플랫폼 라이브러리만 사용하십시오. <code>commonTest</code> 소스 세트에 종속성을 추가하십시오.</li><li><code>kotlin.test</code> API의 <code>Asserter</code> 유형은 간접적으로만 사용해야 합니다. <code>Asserter</code> 인스턴스가 보이지만, 테스트에서 직접 사용할 필요는 없습니다.</li><li>항상 테스트 라이브러리 API 내에서만 작업하십시오. 다행히 컴파일러와 IDE는 프레임워크별 기능을 사용하는 것을 방지합니다.</li><li><code>commonTest</code>에서 테스트를 실행하는 데 어떤 프레임워크를 사용하든 중요하지 않지만, 개발 환경이 올바르게 설정되었는지 확인하기 위해 사용할 각 프레임워크로 테스트를 실행하는 것이 좋습니다.</li><li>물리적 차이를 고려하십시오. 예를 들어, 스크롤 관성과 마찰 값은 플랫폼 및 기기마다 다르므로 동일한 스크롤 속도를 설정하면 다른 스크롤 위치가 발생할 수 있습니다. 예상되는 동작을 보장하기 위해 항상 대상 플랫폼에서 구성 요소를 테스트하십시오.</li><li>플랫폼별 코드에 대한 테스트를 작성할 때는 해당 프레임워크의 기능(예: 어노테이션 및 확장)을 사용할 수 있습니다.</li><li>IDE와 Gradle 작업을 모두 사용하여 테스트를 실행할 수 있습니다.</li><li>테스트를 실행하면 HTML 테스트 보고서가 자동으로 생성됩니다.</li></ul><h2 id="다음-단계" tabindex="-1">다음 단계 <a class="header-anchor" href="#다음-단계" aria-label="Permalink to &quot;다음 단계&quot;">​</a></h2><ul><li><a href="./multiplatform-discover-project">멀티플랫폼 프로젝트 구조 이해하기</a>에서 멀티플랫폼 프로젝트의 레이아웃을 탐색합니다.</li><li>Kotlin 생태계에서 제공하는 또 다른 멀티플랫폼 테스트 프레임워크인 <a href="https://kotest.io/" target="_blank" rel="noreferrer">Kotest</a>를 확인합니다. Kotest는 다양한 스타일로 테스트를 작성할 수 있게 하며, 일반적인 테스트 외에 보완적인 접근 방식을 지원합니다. 여기에는 <a href="https://kotest.io/docs/framework/datatesting/data-driven-testing.html" target="_blank" rel="noreferrer">데이터 기반</a> 및 <a href="https://kotest.io/docs/proptest/property-based-testing.html" target="_blank" rel="noreferrer">속성 기반</a> 테스트가 포함됩니다.</li></ul>',45))])}const R=d(F,[["render",C]]);export{B as __pageData,R as default};
