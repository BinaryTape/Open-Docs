<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="api-references" title="API 참조">
<p>Kotlin API 참조 페이지에 오신 것을 환영합니다. 여기에서는 공식 Kotlin 라이브러리 및 도구의 API 문서 링크를 찾을 수 있습니다.</p>
<list columns="2">
        <li>
            <a href="https://kotlinlang.org/api/core/kotlin-stdlib/"><b>표준 라이브러리 (stdlib)</b></a>
            <br/>
            <p>Kotlin 표준 라이브러리(stdlib)는 컬렉션, 텍스트 및 문자열 처리, 범위, 시퀀스 등 필수 API를 포함하여 Kotlin 프로그래밍을 위한 핵심 기능을 제공합니다. 이 라이브러리는 플랫폼별 API를 확장하고, 해당 API를 사용할 수 있는 Kotlin 우선 API를 제공합니다.</p>
            <img src="github.svg" width="18" alt="GitHub"/> <a href="https://github.com/JetBrains/kotlin">kotlin</a>
            <br/>
        </li>
        <li>
            <a href="https://kotlinlang.org/api/core/kotlin-test/"><b>테스트 라이브러리 (kotlin.test)</b></a>
            <br/>
            <p>공통 테스트 어노테이션 및 유틸리티 함수를 제공하는 멀티플랫폼 테스트 라이브러리입니다. 각 플랫폼의 인기 테스트 프레임워크와의 통합을 지원하며, Kotlin 생태계 전반에서 통일된 테스트 환경을 제공합니다.</p>
            <img src="github.svg" width="18" alt="GitHub"/> <a href="https://github.com/JetBrains/kotlin">kotlin</a>
            <br/>
        </li>
        <li>
            <a href="https://kotlinlang.org/api/kotlinx.coroutines/"><b>코루틴 (kotlinx.coroutines)</b></a>
            <br/>
            <p>Kotlin 코루틴을 사용하여 비동기 프로그래밍을 위한 강력한 라이브러리입니다. 구조화된 동시성, 비동기 스트림, 뮤텍스 및 세마포어와 같은 동기화 프리미티브, 테스트 등을 지원하는 도구를 제공합니다.</p>
            <img src="github.svg" width="18" alt="GitHub"/> <a href="https://github.com/Kotlin/kotlinx.coroutines">kotlinx.coroutines</a>
            <br/>
        </li>
        <li>
            <a href="https://kotlinlang.org/api/kotlinx.serialization/"><b>직렬화 (kotlinx.serialization)</b></a>
            <br/>
            <p>멀티플랫폼 직렬화 라이브러리입니다. Kotlin 객체를 JSON, CBOR, Protocol Buffers와 같은 다양한 형식으로 변환하는 타입 안정적이고 컴파일 시점 메커니즘을 제공합니다.</p>
            <img src="github.svg" width="18" alt="GitHub"/> <a href="https://github.com/Kotlin/kotlinx.serialization">kotlinx.serialization</a>
            <br/>
        </li>
        <li>
            <a href="https://kotlinlang.org/api/kotlinx-io/"><b>Kotlin I/O 라이브러리 (kotlinx-io)</b></a>
            <br/>
            <p>저수준 I/O 작업을 위한 멀티플랫폼 라이브러리입니다. 모든 Kotlin 플랫폼에서 효율적이고 이식 가능하도록 설계된 바이너리 스트림 및 버퍼에서 읽고 쓰는 추상화를 정의합니다.</p>
            <img src="github.svg" width="18" alt="GitHub"/> <a href="https://github.com/Kotlin/kotlinx-io">kotlinx-io</a>
            <br/>
        </li>
        <li>
            <a href="https://kotlinlang.org/api/kotlinx-datetime/"><b>날짜 및 시간 (kotlinx-datetime)</b></a>
            <br/>
            <p>달력 기반 계산을 위한 멀티플랫폼 라이브러리입니다. 날짜 값의 표현을 제공하며 시간대별 작업을 지원합니다.</p>
            <img src="github.svg" width="18" alt="GitHub"/> <a href="https://github.com/Kotlin/kotlinx-datetime">kotlinx-datetime</a>
            <br/>
        </li>
        <li>
            <a href="https://kotlinlang.org/api/kotlinx-metadata-jvm/"><b>JVM 메타데이터 (kotlin-metadata-jvm)</b></a>
            <br/>
            <p>JVM 클래스 파일에 저장된 Kotlin 메타데이터를 읽고 쓰는 라이브러리입니다. 주로 어노테이션 프로세서, 정적 분석기, 컴파일러 플러그인과 같은 도구에서 사용됩니다.</p>
            <img src="github.svg" width="18" alt="GitHub"/> <a href="https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata">kotlinx-metadata</a>
            <br/>
        </li>
        <li>
            <a href="https://kotlinlang.org/api/kotlin-gradle-plugin/"><b>Kotlin Gradle 플러그인 (kotlin-gradle-plugin)</b></a>
            <br/>
            <p>Kotlin 코드 컴파일, 테스트 및 패키징을 위한 Kotlin Gradle 플러그인입니다. 이 플러그인은 JVM 및 멀티플랫폼 빌드를 간소화하고, 종속성을 관리하며, IDE 및 CI 시스템과 통합됩니다.</p>
            <img src="github.svg" width="18" alt="GitHub"/> <a href="https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin">kotlin-gradle-plugin</a>
            <br/>
        </li>
        <li>
            <a href="https://api.ktor.io/"><b>Ktor</b></a>
            <br/>
            <p>Kotlin을 사용하여 연결된 시스템에서 비동기 클라이언트 및 서버를 구축하기 위한 프레임워크입니다. Ktor는 확장성과 유연성을 위해 설계되었으며, 논블로킹 I/O 및 구조화된 동시성을 위해 코루틴과 깊이 통합되어 있습니다.</p>
            <img src="github.svg" width="18" alt="GitHub"/> <a href="https://github.com/ktorio/ktor">ktor</a>
            <br/>
        </li>
</list>
</topic>