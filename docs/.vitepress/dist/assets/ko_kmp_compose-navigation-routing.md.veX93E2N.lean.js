import{_ as k,C as a,c as r,o as E,ag as p,G as s,w as n}from"./chunks/framework.Bksy39di.js";const C=JSON.parse('{"title":"내비게이션 및 라우팅","description":"","frontmatter":{},"headers":[],"relativePath":"ko/kmp/compose-navigation-routing.md","filePath":"ko/kmp/compose-navigation-routing.md","lastUpdated":1755516278000}'),o={name:"ko/kmp/compose-navigation-routing.md"};function d(g,i,c,y,F,m){const e=a("secondary-label"),t=a("code-block"),l=a("TabItem"),h=a("Tabs");return E(),r("div",null,[i[0]||(i[0]=p("",13)),s(e,{ref:"Experimental"},null,512),i[1]||(i[1]=p("",18)),s(h,null,{default:n(()=>[s(l,{title:"Kotlin/Wasm"},{default:n(()=>[s(t,{lang:"Kotlin",code:`        @OptIn(
            ExperimentalComposeUiApi::class,
            ExperimentalBrowserHistoryApi::class,
            ExperimentalSerializationApi::class
        )
        fun main() {
            val body = document.body ?: return
            ComposeViewport(body) {
                App(
                    onNavHostReady = { navController ->
                        // 현재 URL의 프래그먼트 부분 문자열에 접근합니다.
                        val initRoute = window.location.hash.substringAfter('#', "")
                        when {
                            // 해당 경로를 식별하고 그 경로로 내비게이션합니다.
                            initRoute.startsWith("start") -> {
                                navController.navigate(StartScreen)
                            }
                            initRoute.startsWith("find_id") -> {
                                // 문자열을 파싱하여 경로 매개변수를 추출한 다음 해당 경로로 내비게이션합니다.
                                val id = initRoute.substringAfter("find_id_").toLong()
                                navController.navigate(Id(id))
                            }
                            initRoute.startsWith("patient") -> {
                                val name = initRoute.substringAfter("patient_").substringBefore("_")
                                val id = initRoute.substringAfter("patient_").substringAfter("_").toLong()
                                navController.navigate(Patient(name, id))
                            }
                        }
                        window.bindToNavigation(navController) { ... }
                    }
                )
            }
        }`})]),_:1}),s(l,{title:"Kotlin/JS"},{default:n(()=>[s(t,{lang:"kotlin",code:`        @OptIn(
            ExperimentalComposeUiApi::class,
            ExperimentalBrowserHistoryApi::class,
            ExperimentalSerializationApi::class
        )
        fun main() {
            onWasmReady {
                val body = document.body ?: return@onWasmReady
                ComposeViewport(body) {
                    App(
                        onNavHostReady = { navController ->
                            // 현재 URL의 프래그먼트 부분 문자열에 접근합니다.
                            val initRoute = window.location.hash.substringAfter('#', "")
                            when {
                                // 해당 경로를 식별하고 그 경로로 내비게이션합니다.
                                initRoute.startsWith("start") -> {
                                    navController.navigate(StartScreen)
                                }
                                initRoute.startsWith("find_id") -> {
                                    // 문자열을 파싱하여 경로 매개변수를 추출한 다음 해당 경로로 내비게이션합니다.
                                    val id = initRoute.substringAfter("find_id_").toLong()
                                    navController.navigate(Id(id))
                                }
                                initRoute.startsWith("patient") -> {
                                    val name = initRoute.substringAfter("patient_").substringBefore("_")
                                    val id = initRoute.substringAfter("patient_").substringAfter("_").toLong()
                                    navController.navigate(Patient(name, id))
                                }
                            }
                            window.bindToNavigation(navController) { ... }
                        }
                    )
                }
            }
        }`})]),_:1})]),_:1})])}const A=k(o,[["render",d]]);export{C as __pageData,A as default};
