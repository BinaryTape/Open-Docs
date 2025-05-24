---
title: "Kotlin/Native 바이너리용 라이선스 파일"
---
많은 다른 오픈 소스 프로젝트와 마찬가지로 Kotlin은 타사 코드에 의존합니다. 즉, Kotlin 프로젝트에는 JetBrains 또는 Kotlin 프로그래밍 언어 기여자가 개발하지 않은 일부 코드가 포함되어 있습니다. 때로는 C++에서 Kotlin으로 다시 작성된 코드와 같은 파생 작업도 있습니다.

:::note
Kotlin에서 사용되는 타사 작업에 대한 라이선스는 GitHub 저장소에서 확인할 수 있습니다.

* [Kotlin 컴파일러](https://github.com/JetBrains/kotlin/tree/master/license/third_party)
* [Kotlin/Native](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/licenses/third_party)

:::

특히 Kotlin/Native 컴파일러는 타사 코드, 데이터 또는 파생 작업을 포함할 수 있는 바이너리를 생성합니다.
즉, Kotlin/Native 컴파일된 바이너리는 타사 라이선스의 조건에 따라 달라집니다.

실제로 Kotlin/Native 컴파일된 [최종 바이너리](multiplatform-build-native-binaries)를 배포하는 경우,
항상 필요한 라이선스 파일을 바이너리 배포판에 포함해야 합니다. 파일은 읽을 수 있는 형태로 배포 사용자가 액세스할 수 있어야 합니다.

해당 프로젝트에 대해 다음 라이선스 파일을 항상 포함하십시오.
<table>
<tr>
      <th>Project</th>
      <th>Files to be included</th>
</tr>
<tr>
<td>
<a href="https://kotlinlang.org/">Kotlin</a>
</td>
<td rowspan="4">
<list>
<li><a href="https://github.com/JetBrains/kotlin/blob/master/license/LICENSE.txt">Apache license 2.0</a></li>
<li><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/harmony_NOTICE.txt">Apache Harmony copyright notice</a></li>
</list>
</td>
</tr>
<tr>
<td>
<a href="https://harmony.apache.org/">Apache Harmony</a>
</td>
</tr>
<tr>
<td>
<a href="https://www.gwtproject.org/">GWT</a>
</td>
</tr>
<tr>
<td>
<a href="https://guava.dev">Guava</a>
</td>
</tr>
<tr>
<td>
<a href="https://github.com/ianlancetaylor/libbacktrace">libbacktrace</a>
</td>
<td>
<a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/libbacktrace_LICENSE.txt">3-clause BSD license with copyright notice</a>
</td>
</tr>
<tr>
<td>
<a href="https://github.com/microsoft/mimalloc">mimalloc</a>
</td>
<td>

<p>
   <a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mimalloc_LICENSE.txt">MIT license</a>
</p>
<p>
   기본 할당자 대신 mimaloc 메모리 할당자를 사용하는 경우 포함합니다(`-Xallocator=mimalloc` 컴파일러 옵션이 설정됨).
</p>
</td>
</tr>
<tr>
<td>
<a href="https://www.unicode.org/">Unicode character database</a>
</td>
<td>
<a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/unicode_LICENSE.txt">Unicode license</a>
</td>
</tr>
<tr>
<td>
Multi-producer/multi-consumer bounded queue
</td>
<td>
<a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mpmc_queue_LICENSE.txt">Copyright notice</a>
</td>
</tr>
</table>

`mingwX64` 타겟에는 추가 라이선스 파일이 필요합니다.

| Project                                                               | Files to be included                                                                                                                                                                                                                                                                                                              | 
|-----------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [MinGW-w64 headers and runtime libraries](https://www.mingw-w64.org/) | <list><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/COPYING.MinGW-w64-runtime/COPYING.MinGW-w64-runtime.txt">MinGW-w64 runtime license</a></li><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/mingw-w64-libraries/winpthreads/COPYING">Winpthreads license</a></li></list> |
:::note
이러한 라이브러리 중 어느 것도 배포된 Kotlin/Native 바이너리를 오픈 소스로 만들 필요는 없습니다.

:::