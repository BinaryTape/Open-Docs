[//]: # (title: 메이븐)

메이븐은 코틀린 전용 또는 혼합 코틀린-자바 프로젝트를 관리하고 빌드 프로세스를 자동화하는 데 도움이 되는 빌드 시스템입니다.
이는 JVM 기반 프로젝트와 함께 작동하며 필요한 의존성을 다운로드하고, 코드를 컴파일 및 패키징합니다.
기본 사항 및 자세한 내용은 [메이븐](https://maven.apache.org/) 웹사이트에서 확인하세요.

코틀린 메이븐 프로젝트 작업 시 일반적인 워크플로는 다음과 같습니다:

1.  [코틀린 메이븐 플러그인을 적용합니다](maven-configure-project.md#enable-and-configure-the-plugin).
2.  [저장소를 선언합니다](maven-configure-project.md#declare-repositories).
3.  [프로젝트 의존성을 설정합니다](maven-configure-project.md#set-dependencies).
4.  [소스 코드 컴파일을 구성합니다](maven-compile-package.md#configure-source-code-compilation).
5.  [코틀린 컴파일러를 구성합니다](maven-compile-package.md#configure-kotlin-compiler).
6.  [애플리케이션을 패키징합니다](maven-compile-package.md#package-your-project).

시작하려면 다음 단계별 튜토리얼을 따라 할 수도 있습니다:

*   [코틀린과 함께 작동하도록 자바 프로젝트 구성하기](mixing-java-kotlin-intellij.md)
*   [코틀린 및 JUnit5로 자바 메이븐 프로젝트 테스트하기](jvm-test-using-junit.md)

> 메이븐 및 Gradle 빌드 파일이 혼합 코틀린/자바 프로젝트용으로 이미 설정된 공개 [샘플 프로젝트](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete)를 확인해 볼 수 있습니다.
>
{style="tip"}

## 다음 단계는?

*   [`power-assert` 플러그인](power-assert.md#maven)으로 **디버깅 경험을 개선하세요**.
*   [`kover-maven-plugin`](https://kotlin.github.io/kotlinx-kover/maven-plugin/)으로 **테스트 커버리지를 측정하고 보고서를 생성하세요**.
*   [`kapt` 플러그인](kapt.md#use-in-maven)으로 **어노테이션 처리를 구성하세요**.
*   [Dokka 문서 엔진](dokka-maven.md)으로 **문서를 생성하세요**.
    혼합 언어 프로젝트를 지원하며 표준 Javadoc을 포함한 여러 형식으로 출력을 생성할 수 있습니다.
*   [`kotlin-osgi-bundle`](kotlin-osgi.md#maven)을 추가하여 **OSGi 지원을 활성화하세요**.