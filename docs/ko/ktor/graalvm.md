[//]: # (title: GraalVM)

[//]: # (title: GraalVM)

<tldr>
<p>
<control>샘플 프로젝트</control>: <a href="https://github.com/ktorio/ktor-samples/tree/main/graalvm">graalvm</a>
</p>
</tldr>

<web-summary>
Ktor 서버 애플리케이션은 다양한 플랫폼에서 네이티브 이미지(native images)를 갖기 위해 GraalVM을 활용할 수 있습니다.
</web-summary>
<link-summary>
다양한 플랫폼에서 네이티브 이미지(native images)를 위해 GraalVM을 사용하는 방법을 알아보세요.
</link-summary>

Ktor 서버 애플리케이션은 다양한 플랫폼에서 네이티브 이미지(native images)를 갖기 위해 [GraalVM](https://graalvm.org)을 활용할 수 있으며, 물론 GraalVM이 제공하는 더 빠른 시작 시간(start-up times) 및 기타 이점을 누릴 수 있습니다.

현재, GraalVM을 활용하려는 Ktor 서버 애플리케이션은 [애플리케이션 엔진](server-engines.md)으로 CIO를 사용해야 합니다.

## GraalVM 준비

GraalVM을 설치하고 설치 디렉터리를 시스템 경로에 추가하는 것 외에도, 모든 종속성(dependencies)이 번들링되도록 애플리케이션을 준비해야 합니다. 즉, 팻 JAR(fat jar) 파일을 생성해야 합니다.

### 리플렉션(Reflection) 설정

GraalVM은 리플렉션(reflection)을 사용하는 애플리케이션의 경우 [몇 가지 요구 사항](https://www.graalvm.org/22.1/reference-manual/native-image/Reflection/)이 있으며, 이는 Ktor의 경우에도 마찬가지입니다. 특정 타입 정보가 포함된 [JSON 파일](https://github.com/ktorio/ktor-samples/blob/main/graalvm/src/main/resources/META-INF/native-image/reflect-config.json)을 제공해야 합니다. 이 설정 파일은 `native-image` 도구에 인자(argument)로 전달됩니다.

## `native-image` 도구 실행

팻 JAR(fat jar) 파일이 준비되면, 필요한 유일한 단계는 `native-image` CLI 도구를 사용하여 네이티브 이미지(native image)를 생성하는 것입니다. 이는 [Gradle 플러그인](https://graalvm.github.io/native-build-tools/0.9.8/gradle-plugin.html)을 통해서도 수행할 수 있습니다. `build.gradle.kts` 파일의 예시는 [여기](https://github.com/ktorio/ktor-samples/blob/main/graalvm/build.gradle.kts)에서 확인할 수 있습니다. 하지만 사용 중인 종속성(dependencies), 프로젝트의 패키지 이름 등에 따라 일부 옵션이 달라질 수 있다는 점에 유의하세요.

## 결과 바이너리(Binary) 실행

셸 스크립트가 오류 없이 실행되면 네이티브 애플리케이션(native application)을 얻게 되며, 샘플의 경우 `graal-server`라고 불립니다. 이를 실행하면 Ktor 서버가 시작되고, `https://0.0.0.0:8080`에서 응답합니다.

[//]: # (<tldr>)

[//]: # (<var name="example_name" value="deployment-ktor-plugin"/>)

[//]: # (<include from="lib.topic" element-id="download_example"/>)

[//]: # (</tldr>)

[//]: # ()
[//]: # (<link-summary>)

[//]: # (Ktor 서버 애플리케이션은 다양한 플랫폼에서 네이티브 이미지(native images)를 갖기 위해 GraalVM을 활용할 수 있습니다.)

[//]: # (</link-summary>)

[//]: # ()
[//]: # (Ktor 서버 애플리케이션은 다양한 플랫폼에서 네이티브 이미지(native images)를 갖기 위해 [GraalVM]&#40;https://graalvm.org&#41;을 활용할 수 있으며, 물론 GraalVM이 제공하는 더 빠른 시작 시간(start-up times) 및 기타 이점을 누릴 수 있습니다. [Ktor Gradle 플러그인]&#40;https://github.com/ktorio/ktor-build-plugins&#41;을 사용하면 프로젝트의 GraalVM 네이티브 이미지(native image)를 빌드할 수 있습니다.)

[//]: # ()
[//]: # (> 현재, GraalVM을 활용하려는 Ktor 서버 애플리케이션은 [애플리케이션 엔진]&#40;Engines.md&#41;으로 CIO를 사용해야 합니다.)

[//]: # ()
[//]: # (## GraalVM 준비)

[//]: # ()
[//]: # (프로젝트의 GraalVM 네이티브 이미지(native image)를 빌드하기 전에 다음 전제 조건이 충족되었는지 확인하세요:)

[//]: # (- [GraalVM]&#40;https://www.graalvm.org/docs/getting-started/&#41; 및 [네이티브 이미지]&#40;https://www.graalvm.org/reference-manual/native-image/&#41;가 설치되어 있어야 합니다.)

[//]: # (- `GRAALVM_HOME` 및 `JAVA_HOME` 환경 변수가 설정되어 있어야 합니다.)

[//]: # ()
[//]: # (## Ktor 플러그인 구성 {id="configure-plugin"})

[//]: # (네이티브 실행 파일(executable)을 빌드하려면 먼저 Ktor 플러그인을 구성해야 합니다:)

[//]: # (1. `build.gradle.kts` 파일을 열고 `plugins` 블록에 플러그인을 추가합니다:)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="5,8-9"})

[//]: # ()
[//]: # (2. [메인 애플리케이션 클래스]&#40;server-dependencies.xml#create-entry-point&#41;가 구성되었는지 확인하세요:)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="11-13"})

[//]: # ()
[//]: # (3. 선택적으로, `ktor.nativeImage` 확장을 사용하여 생성될 네이티브 실행 파일(executable)의 이름을 구성할 수 있습니다:)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="29,48-51"})

[//]: # ()
[//]: # ()
[//]: # (## 네이티브 실행 파일(executable) 빌드 및 실행 {id="build"})

[//]: # ()
[//]: # (Ktor 플러그인이 제공하는 `buildNativeImage` 태스크는 `build/native/nativeCompile` 디렉터리에 애플리케이션과 함께 네이티브 실행 파일(executable)을 생성합니다.)

[//]: # (이를 실행하면 Ktor 서버가 시작되고, 기본적으로 `https://0.0.0.0:8080`에서 응답합니다.)