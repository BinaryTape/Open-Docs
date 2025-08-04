[//]: # (title: Kotlin/Native 바이너리용 라이선스 파일)

다른 많은 오픈 소스 프로젝트와 마찬가지로, Kotlin은 타사 코드에 의존합니다. 즉, Kotlin 프로젝트에는 JetBrains나 Kotlin 프로그래밍 언어 기여자가 개발하지 않은 일부 코드가 포함되어 있습니다. 때로는 C++에서 Kotlin으로 재작성된 코드와 같은 파생 저작물일 수도 있습니다.

> Kotlin에서 사용되는 타사 작업에 대한 라이선스는 저희 GitHub 저장소에서 찾을 수 있습니다:
>
> * [Kotlin 컴파일러](https://github.com/JetBrains/kotlin/tree/master/license/third_party)
> * [Kotlin/Native](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/licenses/third_party)
>
{style="note"}

특히, Kotlin/Native 컴파일러는 타사 코드, 데이터 또는 파생 저작물을 포함할 수 있는 바이너리를 생성합니다. 이는 Kotlin/Native로 컴파일된 바이너리가 타사 라이선스의 약관에 따라야 함을 의미합니다.

실제로, Kotlin/Native로 컴파일된 [최종 바이너리](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)를 배포하는 경우, 바이너리 배포에 필요한 라이선스 파일을 항상 포함해야 합니다. 이 파일들은 배포 사용자에게 읽을 수 있는 형태로 접근 가능해야 합니다.

해당 프로젝트에 대해 항상 다음 라이선스 파일을 포함하십시오:

<table>
   <tr>
      <th>프로젝트</th>
      <th>포함할 파일</th>
   </tr>
   <tr>
        <td><a href="https://kotlinlang.org/">Kotlin</a></td>
        <td rowspan="4">
         <list>
            <li><a href="https://github.com/JetBrains/kotlin/blob/master/license/LICENSE.txt">Apache License 2.0</a></li>
            <li><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/harmony_NOTICE.txt">Apache Harmony 저작권 고지</a></li>
         </list>
        </td>
   </tr>
   <tr>
        <td><a href="https://harmony.apache.org/">Apache Harmony</a></td>
   </tr>
   <tr>
        <td><a href="https://www.gwtproject.org/">GWT</a></td>
   </tr>
   <tr>
        <td><a href="https://guava.dev">Guava</a></td>
   </tr>
   <tr>
        <td><a href="https://github.com/ianlancetaylor/libbacktrace">libbacktrace</a></td>
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/libbacktrace_LICENSE.txt">저작권 고지 포함 3-clause BSD 라이선스</a></td>
   </tr>
   <tr>
        <td><a href="https://github.com/microsoft/mimalloc">mimalloc</a></td>
        <td>
          <p><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mimalloc_LICENSE.txt">MIT 라이선스</a></p>
          <p>기본 메모리 할당자 대신 mimalloc 메모리 할당자를 사용하는 경우 포함하십시오 (<code>-Xallocator=mimalloc</code> 컴파일러 옵션이 설정된 경우).</p>
        </td>
   </tr>
   <tr>
        <td><a href="https://www.unicode.org/">Unicode 문자 데이터베이스</a></td>
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/unicode_LICENSE.txt">유니코드 라이선스</a></td>
   </tr>
   <tr>
        <td>Multi-producer/multi-consumer bounded queue</td>
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mpmc_queue_LICENSE.txt">저작권 고지</a></td>
   </tr>
</table>

`mingwX64` 타겟은 추가 라이선스 파일이 필요합니다:

| 프로젝트                                                               | 포함할 파일                                                                                                                                                                                                                                                                                                              | 
|-----------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [MinGW-w64 헤더 및 런타임 라이브러리](https://www.mingw-w64.org/) | <list><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/COPYING.MinGW-w64-runtime/COPYING.MinGW-w64-runtime.txt">MinGW-w64 런타임 라이선스</a></li><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/mingw-w64-libraries/winpthreads/COPYING">Winpthreads 라이선스</a></li></list> |

> 이 라이브러리 중 어느 것도 배포된 Kotlin/Native 바이너리가 오픈 소스화될 것을 요구하지 않습니다.
>
{style="note"}